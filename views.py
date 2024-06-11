from flask import Blueprint, render_template,request, jsonify, redirect, send_file
# from process import CleaningProcess # CleaningProcess is a class 
from process import cleaningProcess
from process2 import mainProcess
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


@views.route('/download')
def download():
    fileName = request.args.get('fileName')
    path = request.args.get('filepath')
    return send_file(path,download_name=fileName, as_attachment=True)
    


@views.route('/uploader', methods = ['GET', 'POST'])
def upload_file():

    if request.method == 'POST':
        try:
            f = request.files['file']
            formData = request.form
            if f.filename == '':
                return jsonify({"message":"no file selected"})
            #-------------------------------------------
            # extract the inputs that have the _type in the end
            columnsTypes = {}
            toImputeList = []
            NormalizationSequence = []
            NominalEncodingSequence = []
            OrdinalEncodingSequence = []
            ordinalOrders = {}
            
            for key in formData:
                # columnsTypes -- ends with ( _columnType )
                if key.endswith("_columnType"):
                    columnsTypes[key[:-11]] = formData[key]
                # toImputeList -- ends with ( _imputeType )
                elif key.endswith("_imputeType"):
                    toImputeList.append([ key[:-11], formData[key] ])
                # NormalizationSequence -- ends with ( _normalizationType )
                elif key.endswith("_normalizationType"):
                    NormalizationSequence.append([ key[:-18], formData[key] ])
                # NominalEncodingSequence -- ends with ( _nominal_encodingType )
                elif key.endswith("_nominal_encodingType"):
                    NominalEncodingSequence.append([ key[:-21], formData[key] ])
                # OrdinalEncodingSequence -- ends with ( _ordinal_encodingType )
                elif key.endswith("_ordinal_encodingType"):
                    if (formData[key] != "None"): OrdinalEncodingSequence.append(key[:-21])
                # ordinalOrders -- ends with ( _ordinal_order )
                elif key.endswith("_ordinal_order"):
                    columnName, uniqueValue = key[:-14].split("_|%|_")
                    order = formData[key]
                    if columnName not in ordinalOrders:
                        ordinalOrders[columnName] = {}
                    ordinalOrders[columnName][uniqueValue] = int(order)
            #-------------------------------------------

            # print("\n","columnsTypes","\n", columnsTypes)
            # print("\n","toImputeList","\n", toImputeList)
            # print("\n","NormalizationSequence","\n", NormalizationSequence)
            # print("\n","NominalEncodingSequence","\n", NominalEncodingSequence)
            # print("\n","OrdinalEncodingSequence","\n", OrdinalEncodingSequence)
            # print("\n","ordinalOrders","\n", ordinalOrders)

            fileName = secure_filename(f.filename)
            filePath = os.path.join('uploads', fileName)



            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            
            f.save(filePath)
            # processResult = cleaningProcess(filePath, columnsTypes)
            resultPath = mainProcess(filePath, columnsTypes, toImputeList, NormalizationSequence, NominalEncodingSequence, OrdinalEncodingSequence, ordinalOrders)

            if resultPath == None:
                return jsonify({"message":"process has no results"})
            # if resultPath have message key
            if "message" in resultPath:
                return jsonify(resultPath)

            # delete the file
            os.remove(filePath)
            
            # file_path = os.path.join('uploads', fileName)
            # return render_template("result.html", result=processResult, fileName=fileName)
            file_newName =fileName[:-4]+"_updated.csv"
            return render_template("result.html", file_newName=file_newName, resultPath=resultPath)
            # return send_file(resultPath, download_name=fileName[:-3]+"_updated.csv", as_attachment=True)
            
        except Exception as e:
            return jsonify({"message":"error occured", "details":e})
    else:
        # redirect to the home page
        return redirect("/")

