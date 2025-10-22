from flask import Flask, request, render_template, redirect, url_for, session
from utils.validations import *
from database import db
from werkzeug.utils import secure_filename
import hashlib
import os
from datetime import datetime

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
            data[i] ={"Fecha_de_publicacion":str(aviso.fecha_ingreso),
                    "Fecha_de_entrega":str(aviso.fecha_entrega),
                    "Comuna":str(comuna.nombre),
                    "Sector":str(aviso.sector),
                    "Cantidad_Tipo_Edad":str(aviso.cantidad) + " " + str(aviso.tipo) + ", " + str(aviso.edad) +" " +unidad,
                    "nombre":str(aviso.nombre),
                    "total_de_fotos":2,
                    "id":aviso.id},
            i += 1
            foto = db.get_1foto_by_id(aviso.id)
    return render_template("l_adopcion/vista_individual.html",data=data) 

@app.route("/estadisticas",  methods=["GET", "POST"])
def estadisticas():
    return render_template("estadisticas/estadisticas.html") 

if __name__ == "__main__":
    app.run(debug=True, port=5000)
