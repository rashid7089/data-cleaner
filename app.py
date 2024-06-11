# save this as app.py
from flask import Flask
from views import views


app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = '/uploads'
app.config['MAX_CONTENT_PATH'] = 16 * 1024 * 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = ['.json','.csv']

app.register_blueprint(views, url_prefix="/")



if (__name__ == '__main__'):
    # app.run(debug=True, port = 8000) 
    app.run()