
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
import database

# ============================================================


# create the Flask app:
app = Flask(__name__, static_folder='../frontend', static_url_path='')

CORS(app)

# ==============================================================================================================


FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend')
#================================================================================================================
database.init_db()           
database.add_demo_users()   
@app.route('/')
def show_home_page():
    
    return send_from_directory(FRONTEND_DIR, 'index.html')
#=================================================================================================================
@app.route('/<path:filename>')
def show_any_page(filename):
    """عرض أي صفحة HTML أخرى"""
    
    file_path = os.path.join(FRONTEND_DIR, filename)
    
    # if found the file
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIR, filename)
    
    # if not found the file
    return "File not found", 404

# ============================================================
#API LOGIN
# ============================================================

@app.route('/api/login', methods=['POST'])
def user_login():
    
    # 1. read the data of the user
    data = request.get_json()
    email = data.get('email')        
    password = data.get('password')  
    
    # verify the user data
    user = database.verify_user(email, password)
    
    # if correct user data
    if user:
        session_id = str(datetime.now().timestamp())
        
        # store the session in the data base
        database.create_session(session_id, user['id'])
        
        # نرسل رد للمتصفح يحتوي على بيانات المستخدم ومعرف الجلسة
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "level": user['level']
            },
            "session_id": session_id
        })
    
    # 4. إذا كانت المعلومات خاطئة
    else:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

# ============================================================
# الجزء 7: API إنشاء حساب جديد (تسجيل مستخدم جديد)
# ============================================================

@app.route('/api/register', methods=['POST'])
def create_new_account():
    """إنشاء حساب جديد"""
    
    # 1. نقرأ البيانات التي أرسلها المستخدم
    data = request.get_json()
    name = data.get('name')          # الاسم
    email = data.get('email')        # البريد الإلكتروني
    password = data.get('password')  # كلمة المرور
    level = data.get('level', 'A')   # المستوى (افتراضي A)
    
    # 2. نضيف المستخدم إلى قاعدة البيانات
    result = database.add_user(name, email, password, level)
    
    # 3. إذا تمت الإضافة بنجاح
    if result["success"]:
        # ننشئ جلسة للمستخدم الجديد
        session_id = str(datetime.now().timestamp())
        database.create_session(session_id, result["user_id"])
        
        # نرسل رد للمتصفح
        return jsonify({
            "success": True,
            "message": "Account created successfully",
            "user": {
                "id": result["user_id"],
                "name": name,
                "email": email,
                "level": level
            },
            "session_id": session_id
        })
    
    # 4. إذا فشلت الإضافة (مثل بريد موجود مسبقاً)
    else:
        return jsonify({
            "success": False,
            "message": result["message"]
        }), 400

# ============================================================
# الجزء 8: API التحقق من الجلسة (هل المستخدم لا يزال مسجلاً؟)
# ============================================================

@app.route('/api/verify', methods=['POST'])
def check_session():
    """التحقق من صحة جلسة المستخدم"""
    
    # 1. نقرأ معرف الجلسة من الطلب
    data = request.get_json()
    session_id = data.get('session_id')
    
    # 2. نبحث عن المستخدم المرتبط بهذه الجلسة
    user = database.get_user_by_session(session_id)
    
    # 3. إذا وجدنا المستخدم، الجلسة صالحة
    if user:
        return jsonify({
            "valid": True,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "level": user['level']
            }
        })
    
    # 4. إذا لم نجد المستخدم، الجلسة غير صالحة
    return jsonify({"valid": False}), 401

# ============================================================
# الجزء 9: API تسجيل الخروج (حذف الجلسة)
# ============================================================

@app.route('/api/logout', methods=['POST'])
def user_logout():
    """تسجيل خروج المستخدم"""
    
    # 1. نقرأ معرف الجلسة
    data = request.get_json()
    session_id = data.get('session_id')
    
    # 2. إذا كان هناك جلسة، نحذفها من قاعدة البيانات
    if session_id:
        database.delete_session(session_id)
    
    # 3. نرسل رد نجاح
    return jsonify({"success": True, "message": "Logged out"})

# ============================================================
# الجزء 10: API عرض جميع المستخدمين (للمطور فقط)
# ============================================================

@app.route('/api/users', methods=['GET'])
def show_all_users():
    """عرض جميع المستخدمين المسجلين"""
    
    users = database.get_all_users()
    return jsonify(users)

# ============================================================
# الجزء 11: تشغيل الخادم (بدء الاستماع للطلبات)
# ============================================================

if __name__ == '__main__':
    # نطبع معلومات جميلة للمستخدم
    print("=" * 50)
    print("🚀 Server is running successfully!")
    print("=" * 50)
    print(f"📁 Frontend folder: {FRONTEND_DIR}")
    print(f"🗄️ Database: {database.DB_PATH}")
    print("=" * 50)
    print("🌐 Open your browser at:")
    print("📍 http://localhost:5000")
    print("📍 http://localhost:5000/api/users (to see all users)")
    print("=" * 50)
    print("⚠️ To stop the server: Press Ctrl + C")
    print("=" * 50)
    
    # نبدأ تشغيل الخادم
    app.run(debug=True, port=5000)