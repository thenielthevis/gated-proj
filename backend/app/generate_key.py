from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(key.decode())  # This will print your secret key as a string