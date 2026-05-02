
import sqlite3
import os

# ============================================================
DB_PATH = os.path.join(os.path.dirname(__file__), 'english_platform.db')

# ============================================================

def init_db():
    
    try:
        # 1. الاتصال بقاعدة البيانات (تنشئ الملف إذا لم يكن موجوداً)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 2. إنشاء جدول المستخدمين (users)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                level TEXT DEFAULT 'A',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # 3. إنشاء جدول الجلسات (sessions) - لتذكر المستخدمين المسجلين
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT UNIQUE NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # 4. حفظ التغييرات وإغلاق الاتصال
        conn.commit()
        conn.close()
        
        print("✅ Database initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

# ============================================================
def add_user(name, email, password, level='A'):
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        

        cursor.execute('''
            INSERT INTO users (name, email, password, level)
            VALUES (?, ?, ?, ?)
        ''', (name, email, password, level))
        
        conn.commit()
        
        user_id = cursor.lastrowid
        
        conn.close()
        
        return {"success": True, "user_id": user_id}
        
    except sqlite3.IntegrityError:
        # email already exist
        return {"success": False, "message": "Error in email or password"}
        
    except Exception as e:
        # an other error
        return {"success": False, "message": str(e)}

# ============================================================

def find_user_by_email(email):
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name, email, password, level FROM users WHERE email = ?', (email,))
        
        # 3. جلب النتيجة (صف واحد فقط لأن البريد فريد)
        row = cursor.fetchone()
        
        conn.close()
        
        # 5. إذا وجدنا المستخدم، نعيد بياناته كقاموس (Dictionary)
        if row:
            return {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "password": row[3],
                "level": row[4]
            }
        
        # 6. إذا لم نجد المستخدم، نعيد None
        return None
        
    except Exception as e:
        print(f"Error finding user: {e}")
        return None

# ============================================================

def verify_user(email, password):
    
    # 1. البحث عن المستخدم بالبريد
    user = find_user_by_email(email)
    
    # 2. إذا وجدنا المستخدم وتطابقت كلمة المرور
    if user and user['password'] == password:
        return user  # نعيد بيانات المستخدم
    
    # 3. إذا لم يتطابقا، نعيد None
    return None

# ============================================================

def create_session(session_id, user_id):
    
    try:
        # 1. الاتصال بقاعدة البيانات
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 2. إدراج الجلسة الجديدة
        cursor.execute('''
            INSERT INTO sessions (session_id, user_id)
            VALUES (?, ?)
        ''', (session_id, user_id))
        
        # 3. حفظ التغييرات وإغلاق الاتصال
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"Error creating session: {e}")
        return False

# ============================================================
# الجزء 8: الحصول على مستخدم من معرف الجلسة
# ============================================================

def get_user_by_session(session_id):
    """الحصول على بيانات المستخدم باستخدام معرف الجلسة"""
    
    try:
        # 1. الاتصال بقاعدة البيانات
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 2. البحث عن المستخدم المرتبط بهذه الجلسة
        # نربط جدول sessions مع جدول users باستخدام JOIN
        cursor.execute('''
            SELECT u.id, u.name, u.email, u.level 
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.session_id = ?
        ''', (session_id,))
        
        # 3. جلب النتيجة
        row = cursor.fetchone()
        
        # 4. إغلاق الاتصال
        conn.close()
        
        # 5. إذا وجدنا، نعيد بيانات المستخدم
        if row:
            return {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "level": row[3]
            }
        
        return None
        
    except Exception as e:
        print(f"Error getting user by session: {e}")
        return None

# ============================================================
# الجزء 9: حذف جلسة (تسجيل الخروج)
# ============================================================

def delete_session(session_id):
    """حذف جلسة من قاعدة البيانات (تسجيل الخروج)"""
    
    try:
        # 1. الاتصال بقاعدة البيانات
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 2. حذف الجلسة
        cursor.execute('DELETE FROM sessions WHERE session_id = ?', (session_id,))
        
        # 3. حفظ التغييرات وإغلاق الاتصال
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"Error deleting session: {e}")
        return False

# ============================================================
# الجزء 10: الحصول على جميع المستخدمين (للمطور فقط)
# ============================================================

def get_all_users():
    """الحصول على قائمة بجميع المستخدمين المسجلين"""
    
    try:
        # 1. الاتصال بقاعدة البيانات
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 2. جلب جميع المستخدمين
        cursor.execute('SELECT id, name, email, level, created_at FROM users')
        
        # 3. جلب جميع الصفوف
        rows = cursor.fetchall()
        
        # 4. إغلاق الاتصال
        conn.close()
        
        # 5. تحويل كل صف إلى قاموس وإضافته إلى قائمة
        users = []
        for row in rows:
            users.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "level": row[3],
                "created_at": row[4]
            })
        
        return users
        
    except Exception as e:
        print(f"Error getting all users: {e}")
        return []

# ============================================================
# الجزء 11: إضافة مستخدمين تجريبيين (للتجربة)
# ============================================================

def add_demo_users():
    """إضافة 3 مستخدمين تجريبيين إذا كانت قاعدة البيانات فارغة"""
    
    try:
        # 1. الاتصال بقاعدة البيانات
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 2. حساب عدد المستخدمين الموجودين
        cursor.execute('SELECT COUNT(*) FROM users')
        count = cursor.fetchone()[0]
        conn.close()
        
        # 3. إذا كانت قاعدة البيانات فارغة (0 مستخدمين)
        if count == 0:
            # قائمة المستخدمين التجريبيين
            demo_users = [
                ("Student", "student@example.com", "123456", "B"),
                ("Teacher", "teacher@example.com", "123456", "C"),
                ("Mohamed", "mohamed@gmail.com", "123456", "A")
            ]
            
            # إضافة كل مستخدم تجريبي
            for user in demo_users:
                add_user(user[0], user[1], user[2], user[3])
            
            print("✅ Demo users added successfully!")
        else:
            print(f"ℹ️ Database already has {count} users. Skipping demo users.")
            
    except Exception as e:
        print(f"Error adding demo users: {e}")

# ============================================================
# الجزء 12: عرض جميع المستخدمين (للمطور فقط)
# ============================================================

def show_all_users():
    """عرض جميع المستخدمين في قاعدة البيانات (للتطوير)"""
    
    users = get_all_users()
    
    if users:
        print("\n📋 Users in database:")
        print("-" * 60)
        for user in users:
            print(f"  ID: {user['id']} | Name: {user['name']} | Email: {user['email']} | Level: {user['level']}")
        print("-" * 60)
    else:
        print("📋 No users found in database.")

# ============================================================
# الجزء 13: تشغيل الملف مباشرة (لاختبار قاعدة البيانات)
# ============================================================

if __name__ == '__main__':
    print("=" * 50)
    print("🗄️ Database Setup")
    print("=" * 50)
    
    # 1. إنشاء قاعدة البيانات والجداول
    init_db()
    
    # 2. إضافة المستخدمين التجريبيين
    add_demo_users()
    
    # 3. عرض جميع المستخدمين
    show_all_users()
    
    # 4. معلومات إضافية
    print("\n✅ Database ready!")
    print(f"📁 Database file: {DB_PATH}")