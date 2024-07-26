import socket
import sys
import time
from pathlib import Path
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding

def convert_int_to_bytes(x):
    return x.to_bytes(8, "big")

def convert_bytes_to_int(xbytes):
    return int.from_bytes(xbytes, "big")

def read_bytes(socket, length):
    buffer = []
    bytes_received = 0
    while bytes_received < length:
        data = socket.recv(min(length - bytes_received, 1024))
        if not data:
            raise Exception("Socket connection broken")
        buffer.append(data)
        bytes_received += len(data)
    return b"".join(buffer)

def handle_client(client_socket):
    print("Handling client...")
    while True:
        mode = convert_bytes_to_int(read_bytes(client_socket, 8))
        if mode == 3:
            print("Received authentication request...")
            # Receive authentication message size
            m1_size = convert_bytes_to_int(read_bytes(client_socket, 8))
            print(f"Received message size: {m1_size}")
            
            # Receive authentication message
            message = read_bytes(client_socket, m1_size)
            print(f"Received message: {message}")

            # Sign the message
            with open('source/auth/server_private_key.pem', 'rb') as f:
                server_private_key = serialization.load_pem_private_key(f.read(), password=None)
            signed_message = server_private_key.sign(
                message,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            print(f"Signed message: {signed_message}")

            # Load server certificate
            with open('source/auth/server_signed.crt', 'rb') as f:
                server_cert = f.read()
            print(f"Loaded server certificate: {server_cert}")

            # Send signed message size
            client_socket.send(convert_int_to_bytes(len(signed_message)))
            print(f"Sent signed message size: {len(signed_message)}")
            
            # Send signed message
            client_socket.send(signed_message)
            print(f"Sent signed message.")

            # Send server certificate size
            client_socket.send(convert_int_to_bytes(len(server_cert)))
            print(f"Sent server certificate size: {len(server_cert)}")
            
            # Send server certificate
            client_socket.send(server_cert)
            print("Authentication response sent.")

        elif mode == 0:
            # Receive file name size
            filename_len = convert_bytes_to_int(read_bytes(client_socket, 8))
            
            # Receive file name
            filename = read_bytes(client_socket, filename_len).decode("utf-8")
            print(f"Receiving file: {filename}")
        
        elif mode == 1:
            # Receive file data size
            file_len = convert_bytes_to_int(read_bytes(client_socket, 8))
            print("Receiving file...")
            start_time = time.time()
            
            # Receive file data
            file_data = read_bytes(client_socket, file_len)

            filename = "recv_" + filename.split("/")[-1]
            with open(f"recv_files/{filename}", mode="wb") as fp:
                fp.write(file_data)
            
            elapsed_time = time.time() - start_time
            print(f"Finished receiving file {filename} in {elapsed_time:.20f}s!")

        elif mode == 2:
            print("Closing connection...")
            break

def main():
    port = 4321
    address = "localhost"

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((address, port))
        s.listen()
        print("Server is listening...")
        client_socket, client_address = s.accept()
        with client_socket:
            handle_client(client_socket)

if __name__ == "__main__":
    main()
