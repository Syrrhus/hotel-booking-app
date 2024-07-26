# ClientWithSecurityCP2.py
import socket
import sys
import pathlib
from cryptography import x509
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet

def convert_int_to_bytes(x):
    return x.to_bytes(8, "big")

def convert_bytes_to_int(xbytes):
    return int.from_bytes(xbytes, "big")

def load_public_key_from_cert(cert_filepath):
    # Use an absolute path to ensure the file can be found
    absolute_path = "/mnt/c/users/shrut/downloads/PA2/pa2/source/" + cert_filepath
    with open(absolute_path, "rb") as cert_file:
        cert_data = cert_file.read()
        cert = x509.load_pem_x509_certificate(cert_data, default_backend())
        return cert.public_key()

# Load server's public key
server_public_key = load_public_key_from_cert("auth/server_signed.crt")

def main(args):
    port = int(args[0]) if len(args) > 0 else 4321
    server_address = args[1] if len(args) > 1 else "localhost"

    print("Establishing connection to server...")
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((server_address, port))
        print("Connected")

         # Generate a symmetric session key using Fernet
        session_key_bytes = Fernet.generate_key()
        session_key = Fernet(session_key_bytes)
        print(f"Generated session key: {session_key_bytes.decode(errors='ignore')}")

        # Encrypt the session key with the server's public key
        encrypted_session_key = server_public_key.encrypt(
            session_key_bytes,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )

        # Send MODE: 4
        s.sendall(convert_int_to_bytes(4))

        # Send size of encrypted session key and the encrypted session key itself
        s.sendall(convert_int_to_bytes(len(encrypted_session_key)))
        s.sendall(encrypted_session_key)

        while True:
            filename = input("Enter a filename to send (enter -1 to exit):").strip()

            while filename != "-1" and (not pathlib.Path(filename).is_file()):
                filename = input("Invalid filename. Please try again:").strip()

            if filename == "-1":
                s.sendall(convert_int_to_bytes(2))
                break

            filename_bytes = bytes(filename, encoding="utf8")

            # Send the filename
            s.sendall(convert_int_to_bytes(0))
            s.sendall(convert_int_to_bytes(len(filename_bytes)))
            s.sendall(filename_bytes)

            # Read and encrypt the file
            with open(filename, mode="rb") as fp:
                data = fp.read()
                print(f"Original file data length: {len(data)}")
                encrypted_data = session_key.encrypt(data)
                
                print(f"File data encrypted. Length of encrypted file data: {len(encrypted_data)} bytes")

            # Send the encrypted file
            s.sendall(convert_int_to_bytes(1))
            s.sendall(convert_int_to_bytes(len(encrypted_data)))
            s.sendall(encrypted_data)

        s.sendall(convert_int_to_bytes(2))
        print("Closing connection...")

if __name__ == "__main__":
    main(sys.argv[1:])
