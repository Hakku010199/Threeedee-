def set_axes_cross_at_zero_with_arrows(ax):
    # Move left and bottom spines to zero position
    ax.spines['left'].set_position('zero')
    ax.spines['bottom'].set_position('zero')
    # Hide the top and right spines
    ax.spines['right'].set_color('none')
    ax.spines['top'].set_color('none')
    # Set ticks position
    ax.xaxis.set_ticks_position('bottom')
    ax.yaxis.set_ticks_position('left')
    # Add arrows at the end of axes
    xlim = ax.get_xlim()
    ylim = ax.get_ylim()
    # Arrow for x-axis
    ax.annotate('', xy=(xlim[1], 0), xytext=(xlim[1] - (xlim[1]-xlim[0])*0.05, 0),
                arrowprops=dict(arrowstyle="->", color='black', lw=1.5))
    # Arrow for y-axis
    ax.annotate('', xy=(0, ylim[1]), xytext=(0, ylim[1] - (ylim[1]-ylim[0])*0.05),
                arrowprops=dict(arrowstyle="->", color='black', lw=1.5))
# Helper for Archimedean spiral sweep
def generate_archimedean_spiral_plots(expr_template, a_range, b_range):
    t = np.linspace(0, 4 * np.pi, 2000)
    fig = plt.figure(figsize=(7,7))
    ax = fig.add_subplot(111)
    a_start, a_end, a_step = a_range
    b_start, b_end, b_step = b_range
    # a: 0.1 to 10, step 0.1 (100 values); b: 1 to 10, step 1 (10 values)
    for a in np.arange(a_start, a_end + a_step/2, a_step):
        for b in np.arange(b_start, b_end + b_step/2, b_step):
            expr_str = expr_template.replace('a', f'({a})').replace('b', f'({b})')
            expr_sym = sp.sympify(expr_str, locals=_allowed)
            f = sp.lambdify(theta, expr_sym, modules=["numpy"])
            try:
                r = f(t)
                r = np.array(r, dtype=float)
                x = r * np.cos(t)
                y = r * np.sin(t)
                ax.plot(x, y, alpha=0.5)
            except Exception:
                continue
    ax.set_title(f"Archimedean spirals for a in [{a_start},{a_end}], b in [{b_start},{b_end}]")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.grid(True)
    ax.set_aspect('equal', adjustable='box')
    plt.tight_layout()
    set_axes_cross_at_zero_with_arrows(ax)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120)
    plt.close(fig)
    buf.seek(0)
    return buf
def generate_lemniscate_plots(expr_template, a_range):
    t = np.linspace(0, 2 * np.pi, 2000)
    fig = plt.figure(figsize=(7,7))
    ax = fig.add_subplot(111)
    a_start, a_end, a_step = a_range
    for a in np.arange(a_start, a_end + a_step/2, a_step):
        expr_str = expr_template.replace('a', f'({a})')
        expr_sym = sp.sympify(expr_str, locals=_allowed)
        f = sp.lambdify(theta, expr_sym, modules=["numpy"])
        try:
            r = f(t)
            r = np.array(r, dtype=float)
            x = r * np.cos(t)
            y = r * np.sin(t)
            ax.plot(x, y, alpha=0.5)
        except Exception:
            continue
    ax.set_title(f"Lemniscates for a in [{a_start},{a_end}]")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.grid(True)
    ax.set_aspect('equal', adjustable='box')
    plt.tight_layout()
    set_axes_cross_at_zero_with_arrows(ax)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120)
    plt.close(fig)
    buf.seek(0)
    return buf
# Helper for rose curve sweep
def generate_rose_curve_plots(expr_template, a_range, k_range, types=("cos", "sin")):
    t = np.linspace(0, 2 * np.pi, 2000)
    fig = plt.figure(figsize=(7,7))
    ax = fig.add_subplot(111)
    a_start, a_end, a_step = a_range
    k_start, k_end, k_step = k_range
    for trig in types:
        for a in np.arange(a_start, a_end + a_step, a_step):
            for k in range(k_start, k_end + 1, k_step):
                expr_str = expr_template.replace('a', f'({a})').replace('k', f'({k})')
                expr_str = expr_str.replace("cos", trig).replace("sin", trig)
                expr_sym = sp.sympify(expr_str, locals=_allowed)
                f = sp.lambdify(theta, expr_sym, modules=["numpy"])
                try:
                    r = f(t)
                    r = np.array(r, dtype=float)
                    x = r * np.cos(t)
                    y = r * np.sin(t)
                    ax.plot(x, y, alpha=0.5)
                except Exception:
                    continue
    ax.set_title(f"Rose curves for a in [{a_start},{a_end}], k in [{k_start},{k_end}], types={types}")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.grid(True)
    ax.set_aspect('equal', adjustable='box')
    plt.tight_layout()
    set_axes_cross_at_zero_with_arrows(ax)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120)
    plt.close(fig)
    buf.seek(0)
    return buf

def generate_cardioid_plots(expr_template, a_range, types=("cos", "sin")):
    t = np.linspace(0, 2 * np.pi, 2000)
    fig = plt.figure(figsize=(7,7))
    ax = fig.add_subplot(111)
    a_start, a_end, a_step = a_range
    for trig in types:
        for a in np.arange(a_start, a_end + a_step, a_step):
            expr_str = expr_template.replace('a', f'({a})')
            expr_str = expr_str.replace("cos", trig).replace("sin", trig)
            expr_sym = sp.sympify(expr_str, locals=_allowed)
            f = sp.lambdify(theta, expr_sym, modules=["numpy"])
            try:
                r = f(t)
                r = np.array(r, dtype=float)
                x = r * np.cos(t)
                y = r * np.sin(t)
                ax.plot(x, y, alpha=0.5)
            except Exception:
                continue
    ax.set_title(f"Cardioids for a in [{a_start},{a_end}], types={types}")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.grid(True)
    ax.set_aspect('equal', adjustable='box')
    plt.tight_layout()
    set_axes_cross_at_zero_with_arrows(ax)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120)
    plt.close(fig)
    buf.seek(0)
    return buf
from flask import Flask, request, send_file, send_from_directory, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, create_engine, text
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
from sqlalchemy.orm import declarative_base
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

# Test the database connection at startup
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connection test result:", result.fetchone())
except Exception as e:
    print("Database connection failed:", e)

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

def generate_cartesian_plot(expr_str: str, a_range=None):
    expr_sym = sp.sympify(expr_str, locals=_allowed)
    t = np.linspace(0, 2 * np.pi, 2000)
    fig = plt.figure(figsize=(6,6))
    ax = fig.add_subplot(111)
    if a_range is not None:
        for a in np.linspace(a_range[0], a_range[1], 10):
            f = sp.lambdify((theta, sp.symbols('a')), expr_sym, modules=["numpy"])
            r = f(t, a)
            r = np.array(r, dtype=float)
            x = r * np.cos(t)
            y = r * np.sin(t)
            ax.plot(x, y, label=f"a={a:.2f}")
        ax.legend()
        ax.set_title(f"r = {str(expr_sym)} for a in [{a_range[0]}, {a_range[1]}]")
    else:
        f = sp.lambdify(theta, expr_sym, modules=["numpy"])
        r = f(t)
        r = np.array(r, dtype=float)
        x = r * np.cos(t)
        y = r * np.sin(t)
        ax.plot(x, y, color="#1976d2", linewidth=2)
        ax.set_title(f"r = {str(expr_sym)}")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.grid(True)
    ax.set_aspect('equal', adjustable='box')

    plt.tight_layout()
    set_axes_cross_at_zero_with_arrows(ax)
    buf = io.BytesIO()
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

    # Detect rose curve, cardioid, spiral, lemniscate
    a_range = None
    k_range = None
    b_range = None
    is_rose = False
    is_cardioid = False
    is_spiral = False
    is_lemniscate = False

    # Rose: r = a * cos(k*theta) or r = a * sin(k*theta)
    if ('a' in expr_norm and 'k' in expr_norm and ('cos' in expr_norm or 'sin' in expr_norm)):
        is_rose = True
    # Cardioid: r = a(1+cos(theta)) or r = a(1+sin(theta))
    if ('a' in expr_norm and ('1+cos(theta)' in expr_norm or '1+sin(theta)' in expr_norm)):
        is_cardioid = True
    # Archimedean spiral: r = a + b*theta
    if ('a' in expr_norm and 'b' in expr_norm and 'theta' in expr_norm and ('+' in expr_norm or '-' in expr_norm)):
        is_spiral = True
    # Lemniscate: r^2 = a^2 * cos(2*theta) or r^2 = a^2 * sin(2*theta)
    if (('a' in expr_norm) and (('cos(2*theta)' in expr_norm) or ('sin(2*theta)' in expr_norm)) and ('^2' in expr_norm or '**2' in expr_norm)):
        is_lemniscate = True

    if is_rose and data.get('a_sweep') and data.get('k_sweep'):
        a_range = [0.1, 10, 0.1]
        k_range = [1, 10, 1]
        types = ("cos", "sin")
        try:
            buf = generate_rose_curve_plots(expr_norm, a_range, k_range, types=("cos", "sin"))
        except Exception as e:
            db.close()
            return jsonify({"error": f"Error generating rose curves: {e}"}), 400
    elif is_cardioid and (data.get('a_sweep') or data.get('a_range')):
        a_range = data.get('a_range', [0.1, 10, 0.1])
        types = ("cos", "sin")
        try:
            buf = generate_cardioid_plots(expr_norm, a_range, types=types)
        except Exception as e:
            db.close()
            return jsonify({"error": f"Error generating cardioids: {e}"}), 400
    elif is_spiral and (data.get('a_sweep') or data.get('b_sweep')):
        a_range = [0.1, 10, 0.1]
        b_range = [1, 10, 1]
        try:
            buf = generate_archimedean_spiral_plots(expr_norm, a_range, b_range)
        except Exception as e:
            db.close()
            return jsonify({"error": f"Error generating spirals: {e}"}), 400
    elif is_lemniscate and (data.get('a_sweep') or data.get('a_range')):
        a_range = data.get('a_range', [0.1, 10, 0.1])
        try:
            buf = generate_lemniscate_plots(expr_norm, a_range)
        except Exception as e:
            db.close()
            return jsonify({"error": f"Error generating lemniscates: {e}"}), 400
    else:
        if 'a' in expr_norm:
            if data.get('a_sweep') == True or data.get('a_range'):
                a_range = data.get('a_range', [0.1, 10])
        try:
            buf = generate_cartesian_plot(expr_norm, a_range=a_range)
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
    import os
    import sys
    port = 5000
    # Allow port override via command-line argument or environment variable
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except Exception:
            pass
    elif os.environ.get("PORT"):
        try:
            port = int(os.environ["PORT"])
        except Exception:
            pass
    print(f"Server starting on 0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
