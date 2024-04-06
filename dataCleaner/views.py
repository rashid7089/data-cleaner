from flask import Blueprint, render_template,request, jsonify
# from process import CleaningProcess # CleaningProcess is a class 
from process import cleaningProcess
from werkzeug.utils import secure_filename
# import os
import os

views = Blueprint(__name__,"views")


@views.route("/")
def home():
    return render_template("index.html")

# # test the json
# @views.route("/json")
# def get_json():
#     return jsonify({"name":"tim", "age":123})
#
# @views.route("/process", methods=['POST'])
# def process():
#     data = request.get_json()
#     print(data)
#     print("hello")
#     return jsonify({"result":"result"})



    

@views.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
        f = request.files['file']
        formData = request.form

        # extract the inputs that have the _type in the end
        types = {}
        for key in formData:
            if key.endswith("_type"):
                types[key[:-5]] = formData[key]
        #-------------------------------------------

        print("\n",types,"\n")

        fileName = secure_filename(f.filename)
        filePath = os.path.join('uploads', fileName)
        
        f.save(filePath)
        processResult = cleaningProcess(filePath, types)
        
        # delete the file
        os.remove(filePath)

        return render_template("result.html", result=processResult, fileName=fileName)


