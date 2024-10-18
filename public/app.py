from flask import Flask, request, g, redirect, url_for, render_template
import sqlite3

app = Flask(__name__) # handle web requests and routing

DATABASE = 'stockManagementDB.db'

# Function to connect to the SQLite database
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# Close the database connection when the app context ends
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Route to handle form submission
@app.route('/submit', methods=['POST'])
def submit_data():
    # Columns of the users table
    first_name = request.form['firstName']
    last_name = request.form['lastName']
    email = request.form['email']
    password = request.form['password']
    role = request.form['role']

    # Insert the form data into the SQLite database
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO users (firstName, lastName, email, password, role)
        VALUES (?, ?, ?, ?, ?)
    """, (first_name, last_name, email, password, role))
    db.commit()

    return redirect(url_for('thank_you'))

# Route to show a thank you page after form submission
@app.route('/thank_you')
def thank_you():
    return "Thank you for your submission!"

if __name__ == '__main__':
    app.run(debug=True)
