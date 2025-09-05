from flask import Flask, request, send_file, send_from_directory, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import io
import os
import uuid
import datetime
import re
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import sympy as sp

BASE_DIR = os.path.dirname(__file__)
PLOTS_DIR = os.path.join(BASE_DIR, "plots")
os.makedirs(PLOTS_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)

# --- DB setup (SQLite) ---
DB_PATH = os.path.join(BASE_DIR, "app.db")
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(150), nullable=True)
    email = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    token = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    plots = relationship("Plot", back_populates="user")

class Plot(Base):
    __tablename__ = "plots"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    expr = Column(Text, nullable=False)
    filename = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="plots")

Base.metadata.create_all(engine)

# SymPy setup
theta = sp.symbols("theta")
_allowed = {
    'sin': sp.sin, 'cos': sp.cos, 'tan': sp.tan,
    'asin': sp.asin, 'acos': sp.acos, 'atan': sp.atan,
    'exp': sp.exp, 'sqrt': sp.sqrt, 'log': sp.log,
    'pi': sp.pi, 'E': sp.E, 'theta': theta, 'abs': sp.Abs
}

def normalize_expression(expr_raw: str) -> str:
    if not expr_raw:
        return ""
    e = expr_raw.replace("Θ", "theta").replace("θ", "theta")
    e = e.replace("^", "**")
    e = e.replace(" ", "")
    e = re.sub(r'(\d)([A-Za-z\(])', r'\1*\2', e)
    e = e.replace(")(", ")*(")
    e = re.sub(r'\)([A-Za-z\(])', r')*\1', e)
    e = re.sub(r'\*+', '*', e)
    if e.lower().startswith("r="):
        e = e[2:]
    return e

def generate_cartesian_plot(expr_str: str):
    expr_sym = sp.sympify(expr_str, locals=_allowed)
    f = sp.lambdify(theta, expr_sym, modules=["numpy"])
    t = np.linspace(0, 2 * np.pi, 2000)
    r = f(t)
    r = np.array(r, dtype=float)
    x = r * np.cos(t)
    y = r * np.sin(t)

    fig = plt.figure(figsize=(6,6))
    ax = fig.add_subplot(111)
    ax.plot(x, y, color="#1976d2", linewidth=2)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title(f"r = {str(expr_sym)}")
    ax.grid(True)
    ax.set_aspect('equal', adjustable='box')

    buf = io.BytesIO()
    plt.tight_layout()
    fig.savefig(buf, format="png", dpi=120)
    plt.close(fig)
    buf.seek(0)
    return buf

def get_user_by_token(db, token):
    if not token:
        return None
    return db.query(User).filter(User.token == token).first()

# --- Auth endpoints ---
@app.route("/register", methods=["POST"])
def register():
    db = SessionLocal()
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    username = (data.get("username") or "").strip()

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    if db.query(User).filter(User.email == email).first():
        return jsonify({"error": "email already registered"}), 400

    hashed = generate_password_hash(password)
    user = User(email=email, username=username or None, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return jsonify({"message": "registered", "user_id": user.id}), 201

@app.route("/login", methods=["POST"])
def login():
    db = SessionLocal()
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = db.query(User).filter(User.email == email).first()
    if not user or not check_password_hash(user.password_hash, password):
        db.close()
        return jsonify({"error": "invalid credentials"}), 401
    token = uuid.uuid4().hex
    user.token = token
    db.commit()
    resp = {"message": "ok", "token": token, "user_id": user.id, "username": user.username}
    db.close()
    return jsonify(resp)

@app.route("/plot", methods=["POST"])
def plot():
    db = SessionLocal()
    data = request.get_json() or {}
    expr_raw = (data.get("expr") or "").strip()
    token = data.get("token")  # optional
    if not expr_raw:
        db.close()
        return jsonify({"error": "No expression provided"}), 400

    expr_norm = normalize_expression(expr_raw)
    try:
        buf = generate_cartesian_plot(expr_norm)
    except Exception as e:
        db.close()
        return jsonify({"error": f"Error generating plot: {e}"}), 400

    filename = f"{uuid.uuid4().hex}.png"
    filepath = os.path.join(PLOTS_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(buf.getbuffer())

    user = get_user_by_token(db, token)
    plot_record = Plot(user_id=user.id if user else None, expr=expr_raw, filename=filename)
    db.add(plot_record)
    db.commit()
    db.close()

    return jsonify({"url": f"/plots/{filename}", "filename": filename})

@app.route("/plots/<path:filename>")
def serve_plot(filename):
    return send_from_directory(PLOTS_DIR, filename)

@app.route("/my-plots", methods=["GET"])
def my_plots():
    token = request.args.get("token")
    db = SessionLocal()
    user = get_user_by_token(db, token)
    if not user:
        db.close()
        return jsonify({"error": "invalid token"}), 401
    plots = [{"id": p.id, "expr": p.expr, "url": f"/plots/{p.filename}", "created_at": p.created_at.isoformat()} for p in user.plots]
    db.close()
    return jsonify({"plots": plots})

if __name__ == "__main__":
    print("Server starting on 0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
