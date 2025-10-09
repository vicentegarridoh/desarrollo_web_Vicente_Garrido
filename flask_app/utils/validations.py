import re
import filetype
from datetime import datetime, timedelta

def validate_conf_img(conf_img):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}

    # check if a file was submitted
    if conf_img is None:
        return False

    # check if the browser submitted an empty file
    if conf_img.filename == "":
        return False
    
    # check file extension
    ftype_guess = filetype.guess(conf_img)
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False
    # check mimetype
    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    return True

def valida_sector(sector):
    length_valid = len(sector) <= 100
    return length_valid

def validate_natural(numero):
    if not numero:
        return False
    if numero % 1 != 0:
        return False
    return True

def validate_name(name):
    if not name:
        return False
    if len(name.strip()) <= 200:
        if  len(name.strip()) >= 3:
            return True
    return False

def validate_email(email):
    if not email:
        return False
    if len(email) > 15:
        pattern = r'^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$'
        if bool(re.match(pattern, email)) == True:
            return True
    return False

def validate_phone_number(phone_number):
    if not phone_number:
        return False
    if len(phone_number) >= (5 + 8):
        pattern = r'^\s*\+569\.'
        if bool(re.match(pattern, phone_number)) == True:
            return True
    return False

def validate_tipo(tipo):
    if tipo == "perro" or  tipo == "gato" or  tipo == "otro":
        return True
    return False

def validateFecha(fecha_str):
    fecha_ingresada = datetime.strptime(fecha_str, "%Y-%m-%d %H:%M:%S")
    fecha_actual = datetime.now().replace(microsecond=0)
    diferencia = fecha_ingresada - fecha_actual
    return diferencia >= timedelta(hours=3)


def validate_un_edad(unidad):
    if unidad == "meses" or unidad == "mes" or unidad == "años" or unidad == "año":
        return True
    return False
        

def validate_aviso(comuna,sector,name,numero,tipo,cantidad,edad,unidad,fecha,fotos,contacto,email):
    #comuna,sector,name,email,numero,tipo,cantidad,edad,un_edad,fecha,fotos,contacto
    v_sector = valida_sector(sector)
    v_comuna = True
    v_name = validate_name(name)
    v_numero = validate_phone_number(numero)
    v_tipo = validate_tipo(tipo)
    v_cantidad = validate_natural(cantidad)
    v_edad = validate_natural(edad)
    v_un_edad = validate_un_edad(unidad)
   # v_fecha = validateFecha(fecha)
    v_fotos = True
    v_contacto = True
  #  v_email = validate_email(email)

    return v_sector and v_comuna and v_name 

    #return v_sector and  v_sector and v_name and v_numero and v_tipo and v_cantidad and v_edad and v_un_edad and  v_fotos
