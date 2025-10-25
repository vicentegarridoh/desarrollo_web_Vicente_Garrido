from flask import Flask, request, render_template, redirect, url_for, session,jsonify
from flask_cors import cross_origin
from utils.validations import *
from database import db
from werkzeug.utils import secure_filename
import hashlib
import os
from datetime import datetime
import random
import time
from collections import Counter

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000


@app.route("/")
def index():
    data = {}
    i = 1
    for aviso in db.get_aviso_ultimo(page_size=5):
        comuna = db.get_comuna_by_id(aviso.comuna_id)
        unidad = aviso.unidad_medida
        if unidad == "m" and aviso.edad > 1:
            unidad = "meses"
        elif unidad == "m":
            unidad = "mes"
        elif unidad == "a" and aviso.edad > 1:
            unidad = "años"
        elif unidad == "a" :
            unidad = "año"
        else:
            unidad = "error"
        foto = db.get_1foto_by_id(aviso.id)
        foto = foto.ruta_archivo

        data[i] ={"Fecha_de_publicacion":str(aviso.fecha_ingreso),
                "Comuna":str(comuna.nombre),
                "Sector":str(aviso.sector),
                "Cantidad_Tipo_Edad":str(aviso.cantidad) + " " + str(aviso.tipo) + ", " + str(aviso.edad) +" " +unidad,
                "Foto":foto},
        i += 1
    return render_template("index/index.html",data=data)

@app.route("/agregar_form_aviso",  methods=["POST"])
def agregar_form_aviso():
    comuna_n = request.form.get("select-comuna")
    comuna = db.get_comuna_by_name(comuna_n)
    nombre = request.form.get("nombre_c")
    correo = request.form.get("email")
    tipo = request.form.get("tipo_m")
    if tipo == "opcion1":
        tipo =  "perro"
    elif tipo == "opcion2":
        tipo = "gato"
    else:
        tipo == "otro"
    cantidad = int(request.form.get("cantidad_m"))
    unidad = request.form.get("un_edad")
    if unidad == "opcion1":
        unidad =  "m"
    elif unidad == "opcion2":
        unidad = "a"
    else:
        unidad == "error"
    edad = int(request.form.get("edad_m"))
    celular = request.form.get("numero_celular")
    sector = request.form.get("sector")
    descripcion = request.form.get("descripcion_m")
    fecha_entrega = request.form.get("fecha_entrega")
    
    #contacto
    # Acceder a campos específicos
    whatsapp = request.form.get('contact_whatsapp')
    telegram = request.form.get('contact_telegram') 
    x = request.form.get('contact_x') 
    instagram = request.form.get('contact_instagram') 
    tiktok = request.form.get('contact_tiktok') 
    other = request.form.get('contact_other')  
    contactos = [["whatsapp",whatsapp],["telegram",telegram],["x",x],["instagram",instagram],["tiktok",tiktok],["otra",other]]

    fotos = True
    if validate_aviso(comuna,sector,nombre,celular,tipo,cantidad,edad,unidad,fecha_entrega,fotos,contactos,correo):
        fotos = []
        archivos = []
        #barremos los datos 
        for i in range(1, 6): 
            file_key = f"file-input-{i}"
            archivo = request.files.get(file_key)
            if archivo and archivo.filename != '':
                archivos.append(archivo)

        #vemos cada imagen de la lista
        for idx, archivo in enumerate(archivos, 1):
            if archivo and archivo.filename != '':
                _filename = hashlib.sha256(
                    secure_filename(archivo.filename) 
                    .encode("utf-8") 
                    ).hexdigest()
                _extension = filetype.guess(archivo).extension
                filename = f"{_filename}.{_extension}"
                fotos.append(filename)
                # Guardar archivo
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                archivo.save(file_path)
        
        db.create_aviso_m(comuna.id,sector,nombre,correo,celular,tipo,cantidad,edad,unidad,fecha_entrega,descripcion,contactos,fotos)

        return redirect(url_for("index"))
    else: 
        print("error")


@app.route("/aviso",  methods=["GET", "POST"])
def aviso():
    return render_template("aviso/aviso.html")  



@app.route("/vista/<int:arg>",  methods=["GET"])
def vista(arg):
    data = {}
    aviso = db.get_aviso_especifico(arg)
    comentarios = db.get_comentarios(aviso.id)
    comentarios_display = []
    for com in comentarios:
        comentarios_display.append([com.nombre,com.texto])
    
    fotosmulti = db.get_foto_by_id(aviso.id)
    fotos_display = []
    for a in fotosmulti:
        fotos_display.append(a.ruta_archivo)
    comuna = db.get_comuna_by_id(aviso.comuna_id)
    region = db.get_region_by_id(int(comuna.region_id))
    unidad = aviso.unidad_medida
    if unidad == "m" and aviso.edad > 1:
        unidad = "meses"
    elif unidad == "m":
        unidad = "mes"
    elif unidad == "a" and aviso.edad > 1:
        unidad = "años"
    elif unidad == "a" :
        unidad = "año"
    else:
        unidad = "error"
    data={"Fecha_de_publicacion":str(aviso.fecha_ingreso),
            "Fecha_de_entrega":str(aviso.fecha_entrega),
            "Comuna":str(comuna.nombre),
            "Region":str(region.nombre),
            "Sector":str(aviso.sector),
            "Cantidad":str(aviso.cantidad),
            "tipo":str(aviso.tipo),
            "edad":str(aviso.edad) +" " +unidad,
            "nombre":str(aviso.nombre),
            "descripcion":str(aviso.descripcion),
            "correo":str(aviso.email),
            "numero":str(aviso.celular),
            "comentarios":comentarios_display,
            "Foto":fotos_display,
            "total_de_fotos":len(fotos_display),
            "id":aviso.id},
    return render_template("l_adopcion/vista_individual.html",data = data)  




@app.route("/api/agregar_comentario/<int:aviso_id>", methods=["POST"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def api_agregar_comentario(aviso_id):
    data = request.json
    usuario = data.get("usuario")
    comentario = data.get("comentario")

    if validate_comentario(usuario,comentario) == False:
        return "Datos inválidos" 
        
    db.create_comentario(usuario, comentario, aviso_id)
    return jsonify({
        "success": True, 
        "comentario": {
            "usuario": usuario, 
            "texto": comentario
        }
    })


@app.route("/l_adopcion/<int:arg>/<int:arg2>",  methods=["GET", "POST"])
def lista(arg,arg2):
    if arg2 == 0:
        data = {}
        data["args"] = (arg,arg2)
        i = 1
        pag = int(arg)
        for aviso in db.get_aviso_paginado(int(arg)):
            comuna = db.get_comuna_by_id(aviso.comuna_id)
            unidad = aviso.unidad_medida
            if unidad == "m" and aviso.edad > 1:
                unidad = "meses"
            elif unidad == "m":
                unidad = "mes"
            elif unidad == "a" and aviso.edad > 1:
                unidad = "años"
            elif unidad == "a" :
                unidad = "año"
            else:
                unidad = "error"
            fotosmulti = db.get_foto_by_id(aviso.id)
            fotos_num = 0
            for a in fotosmulti:
                fotos_num += 1
            data[aviso.id] ={"Fecha_de_publicacion":str(aviso.fecha_ingreso),
                    "Fecha_de_entrega":str(aviso.fecha_entrega),
                    "Comuna":str(comuna.nombre),
                    "Secto  r":str(aviso.sector),
                    "Cantidad_Tipo_Edad":str(aviso.cantidad) + " " + str(aviso.tipo) + ", " + str(aviso.edad) +" " +unidad,
                    "nombre":str(aviso.nombre),
                    "total_de_fotos":fotos_num,
                    "id":aviso.id},
            i += 1
    return render_template("l_adopcion/l_adopcion.html",data=data) 


@app.route("/estadisticas",  methods=["GET", "POST"])
def estadisticas():
    return render_template("estadisticas/estadisticas.html") 


@app.route("/get-stats-data", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data():
    date_list = [
        aviso.fecha_ingreso.date() 
        for aviso in db.get_aviso_ultimo(page_size=500) 
        if aviso.fecha_ingreso 
    ]
    date_counts = Counter(date_list)
    processed_data = [
        {
            "date": date_obj.strftime("%Y-%m-%d"),
            "count": count
        } 
        for date_obj, count in date_counts.items()
    ]
    processed_data.sort(key=lambda x: x["date"])

    return jsonify(processed_data)

@app.route("/get-stats-data2", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data2():
    type_list = [
        aviso.tipo
        for aviso in db.get_aviso_ultimo(page_size=500)
        if aviso.tipo 
    ]
    type_counts = Counter(type_list)
    
    processed_data = [
        {
            "name": tipo.capitalize(), 
            "y": count
        }
        for tipo, count in type_counts.items()
    ]
    
    processed_data.sort(key=lambda x: x["y"], reverse=True)
    print(processed_data)
    return jsonify(processed_data)


@app.route("/get-stats-data3", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data3():
    dict = {}
    i = 1
    while i<13:
        dict[202500+i] = {"perro":0,"gato":0}
        i+=1
    print("biennnn")


    for aviso in db.get_aviso_ultimo(page_size=500):
        tipo = aviso.tipo
        year = aviso.fecha_ingreso.year
        mes = aviso.fecha_ingreso.month
        dia = aviso.fecha_ingreso.day
        formato = year * 100 + mes
        if formato not in dict:
            dict[formato] = {"perro":0,"gato":0}
        dict[formato][tipo] += 1
    lista_perro = []
    lista_gato = []
    for elem in dict:
        lista_perro.append(dict[elem]["perro"])
    for elem in dict:
        lista_gato.append(dict[elem]["gato"])
    
    lista = [lista_gato,lista_perro] 

    return jsonify(lista)

@app.route("/get-stats-data4", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data4():
    data = {}
    i = 1
    for aviso in db.get_aviso_paginado(500):
        comuna = db.get_comuna_by_id(aviso.comuna_id)
        unidad = aviso.unidad_medida
        if unidad == "m" and aviso.edad > 1:
            unidad = "meses"
        elif unidad == "m":
            unidad = "mes"
        elif unidad == "a" and aviso.edad > 1:
            unidad = "años"
        elif unidad == "a" :
            unidad = "año"
        else:
            unidad = "error"
        data[i] ={"Fecha_de_publicacion":str(aviso.fecha_ingreso),
                "Fecha_de_entrega":str(aviso.fecha_entrega),
                "Comuna":str(comuna.nombre),
                "Sector":str(aviso.sector),
                "Cantidad_Tipo_Edad":str(aviso.cantidad) + " " + str(aviso.tipo) + ", " + str(aviso.edad) +" " +unidad,
                "nombre":str(aviso.nombre),
                "total_de_fotos":2,
                "id":aviso.id},
        i += 1
    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=True, port=5000)
