-- Seed file for Cairo Cosmo Center Database

-- Insert default admin user (email: admin@cairocosmo.com / password: admin123)
INSERT INTO admin_users (name, email, password_hash, role) 
VALUES ('مدير النظام', 'admin@cairocosmo.com', '$2y$12$rQkfL3Z1zoAKGnDTuMbqHOuKJKrDLu7cf1W/W3w45oWljrgVEH0bC', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample customers for CRM testing
INSERT INTO customers (name, phone, email, notes, admin_notes, bookings_count, last_booking_date) VALUES
('نور محمود السعيد', '01012345678', 'nour.mahmoud@gmail.com', 'تفضل فرع مصر الجديدة الفترة المسائية', 'عميلة VIP، تفضل دكتورة ناهد سمير', 6, '2026-08-10 14:30:00'),
('سارة علي عبد الله', '01123456789', 'sara.ali@yahoo.com', 'ترغب في الاستفسار عن عروض الفيلر', 'متابعة الدفعة الأولى', 3, '2026-08-01 16:00:00'),
('أحمد إبراهيم حسان', '01234567890', 'ahmed.hessen@outlook.com', 'جلسات تنظيف للبشرة العميق', 'عميل جديد تم التواصل معه عبر الواتساب', 1, '2026-08-16 11:00:00'),
('ياسمين طارق يوسف', '01555667788', 'yasmine.tarek@gmail.com', 'حجز ليزر إزالة الشعر كامل الجسم', 'منتظمة في المواعيد', 4, '2026-07-20 18:00:00'),
('محمد مصطفى كمال', '01099887766', 'm.kamal@gmail.com', 'جلسات علاج حب الشباب والرؤوس السوداء', 'طلب استشارة دكتور باسم زكي', 2, '2026-06-15 15:00:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample bookings
INSERT INTO bookings (customer_id, service, branch, date, notes, status, service_price) VALUES
(1, 'جلسة هيدرافيدر بلس لتنقية البشرة', 'sheraton', '2026-08-10 14:30:00', 'حجز مؤكد مع المتابعة الدورية', 'completed', 1500.00),
(1, 'حقن بوتوكس التجاعيد الجبهة والعين', 'sheraton', '2026-07-05 16:00:00', 'تمت الجلسة بنجاح', 'completed', 3500.00),
(2, 'جلسة نضارة وتقشير كيميائي أحماض فواكه', 'dokki', '2026-08-01 16:00:00', 'جلسة تقشير متوسط العمق', 'completed', 1200.00),
(3, 'جلسة تنظيف بشرة عميق بالهيدرافيدر', 'october', '2026-08-16 11:00:00', 'جلسة استكشافية أولى', 'confirmed', 900.00),
(4, 'جلسة ليزر إزالة الشعر كانديلا دوانت', 'mansoura', '2026-07-20 18:00:00', 'الجلسة الرابعة من الكورس', 'completed', 2200.00),
(5, 'علاج آثار حب الشباب بالديرمابين والديرمارولر', 'shubra', '2026-06-15 15:00:00', 'تم صرف الكريمات المخصصة', 'completed', 1800.00)
ON DUPLICATE KEY UPDATE service = VALUES(service);

-- Insert sample offers
INSERT INTO offers (title, description) VALUES
('عرض نضارة الصيف الفوري', 'احصلي على خصم 30% على جلسات الهيدرافيدر والبوتوكس هذا الأسبوع!'),
('باكج إزالة الشعر بالليزر المتكامل', 'اشتركي في 5 جلسات واحصلي على الجلسة السادسة مجاناً مع التبريد المطور.'),
('عرض الفيلر وتحديد الشفاه', 'تحديد وقوام طبيعي للشفاه مع الاستشارة المجانية قبل الجلسة.')
ON DUPLICATE KEY UPDATE title = VALUES(title);
