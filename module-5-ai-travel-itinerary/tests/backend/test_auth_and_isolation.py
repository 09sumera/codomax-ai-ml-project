import unittest
import uuid
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from backend.app import create_app

class TestAuthAndDataIsolation(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_demo_user_ready(self):
        res = self.client.get('/api/auth/demo')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get('email'), 'demo@routeshield.ai')
        self.assertIn('password', data)

    def test_signup_and_login_flow(self):
        unique_email = f"operator_{uuid.uuid4().hex[:8]}@routeshield.ai"

        # 1. Signup
        signup_payload = {
            "name": "Sarah Connor",
            "email": unique_email,
            "password": "resilientpassword123",
            "role": "Logistics Analyst",
            "company": "Cyberdyne Logistics"
        }
        signup_res = self.client.post('/api/auth/signup', json=signup_payload)
        self.assertEqual(signup_res.status_code, 201)
        signup_json = signup_res.get_json()
        token = signup_json.get('token')
        user = signup_json.get('user')
        self.assertIsNotNone(token)
        self.assertEqual(user['email'], unique_email)
        self.assertEqual(user['name'], "Sarah Connor")

        # 2. Duplicate signup should be rejected
        dup_res = self.client.post('/api/auth/signup', json=signup_payload)
        self.assertEqual(dup_res.status_code, 400)

        # 3. Login
        login_res = self.client.post('/api/auth/login', json={
            "email": unique_email,
            "password": "resilientpassword123"
        })
        self.assertEqual(login_res.status_code, 200)
        login_json = login_res.get_json()
        self.assertIsNotNone(login_json.get('token'))
        self.assertEqual(login_json.get('user')['email'], unique_email)

        # 4. Bad password should fail
        bad_login = self.client.post('/api/auth/login', json={
            "email": unique_email,
            "password": "wrongpassword"
        })
        self.assertEqual(bad_login.status_code, 401)

        # 5. Access profile via /api/auth/me
        me_res = self.client.get('/api/auth/me', headers={
            "Authorization": f"Bearer {token}"
        })
        self.assertEqual(me_res.status_code, 200)
        me_json = me_res.get_json()
        self.assertEqual(me_json['user']['email'], unique_email)

    def test_strict_user_data_isolation(self):
        email_a = f"usera_{uuid.uuid4().hex[:8]}@test.com"
        email_b = f"userb_{uuid.uuid4().hex[:8]}@test.com"

        res_a = self.client.post('/api/auth/signup', json={
            "name": "User Alpha", "email": email_a, "password": "password123"
        })
        token_a = res_a.get_json()['token']

        res_b = self.client.post('/api/auth/signup', json={
            "name": "User Beta", "email": email_b, "password": "password123"
        })
        token_b = res_b.get_json()['token']

        # User A saves route NYC -> London
        self.client.post('/api/routes/save', headers={"Authorization": f"Bearer {token_a}"}, json={
            "origin": {"name": "New York City Port", "latitude": 40.7128, "longitude": -74.0060},
            "destination": {"name": "London Gateway", "latitude": 51.5074, "longitude": -0.1278},
            "distance_km": 5580,
            "duration_minutes": 4200,
            "pois": {}
        })

        # User B saves route Tokyo -> Sydney
        self.client.post('/api/routes/save', headers={"Authorization": f"Bearer {token_b}"}, json={
            "origin": {"name": "Tokyo Port", "latitude": 35.6762, "longitude": 139.6503},
            "destination": {"name": "Sydney Harbour", "latitude": -33.8688, "longitude": 151.2093},
            "distance_km": 7820,
            "duration_minutes": 5900,
            "pois": {}
        })

        # Query User A routes
        routes_a = self.client.get('/api/routes/saved', headers={"Authorization": f"Bearer {token_a}"}).get_json()['routes']
        origins_a = [r['origin']['name'] for r in routes_a]
        self.assertIn("New York City Port", origins_a)
        self.assertNotIn("Tokyo Port", origins_a)

        # Query User B routes
        routes_b = self.client.get('/api/routes/saved', headers={"Authorization": f"Bearer {token_b}"}).get_json()['routes']
        origins_b = [r['origin']['name'] for r in routes_b]
        self.assertIn("Tokyo Port", origins_b)
        self.assertNotIn("New York City Port", origins_b)

if __name__ == '__main__':
    unittest.main()
