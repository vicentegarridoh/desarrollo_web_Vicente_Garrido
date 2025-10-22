
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Text, Enum,  BigInteger
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy.sql import func
from datetime import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb" 
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

##se crean las tablas
class Region(Base):
    __tablename__ = 'region'
    #entidades
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    #relaciones
    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = 'comuna'
    #entidades
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)
    #relaciones
    region = relationship("Region", back_populates="comunas")
    avisos_adopcion = relationship("AvisoAdopcion", back_populates="comuna")

class AvisoAdopcion(Base):
    __tablename__ = 'aviso_adopcion'
    #entidades
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False, default=datetime.now)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    tipo = Column(Enum('gato', 'perro', name='tipo_animal'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum('a', 'm', name='unidad_edad'), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text(500))
    #relaciones
    comuna = relationship("Comuna", back_populates="avisos_adopcion")
    fotos = relationship("Foto", back_populates="aviso")
    contactos = relationship("ContactarPor", back_populates="aviso")

class Foto(Base):
    __tablename__ = 'foto'
    #entidades
    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False) 
    #relaciones
    aviso = relationship("AvisoAdopcion", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    #entidades
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra', 
                        name='red_social'), nullable=False)
    identificador = Column(String(150), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    #relaciones
    aviso = relationship("AvisoAdopcion", back_populates="contactos")

#creacion de metodos
def get_aviso(page_size):
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion).limit(page_size).all()
    session.close()
    return aviso

def get_aviso_ultimo(page_size):
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion)\
        .order_by(AvisoAdopcion.id.desc())\
        .limit(page_size)\
        .all()
    session.close()
    return aviso


# Uso:
# f(1) -> registros 1-5
# f(2) -> registros 6-10
# f(3) -> registros 11-15
def get_aviso_paginado(multiplicador, page_size=5):
    session = SessionLocal()
    offset = (multiplicador - 1) * page_size
    aviso = session.query(AvisoAdopcion)\
        .order_by(AvisoAdopcion.id)\
        .offset(offset)\
        .limit(page_size)\
        .all()
    session.close()
    return aviso

def get_comuna_by_id(id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=id).first()
    session.close()
    return comuna

def get_comuna_by_name(name):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(nombre=name).first()
    session.close()
    return comuna

def get_1foto_by_id(id):
    session = SessionLocal()
    foto = session.query(Foto).filter_by(aviso_id=id).first()
    session.close()
    return foto

def create_aviso_m(comuna_id,sector,nombre,email,celular,tipo,cantidad,edad,unidad_medida,fecha_entrega,descripcion,contactos,fotos):
    session = SessionLocal()
    aviso = AvisoAdopcion(
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            tipo=tipo,
            cantidad=cantidad,
            edad=edad,
            unidad_medida=unidad_medida,
            fecha_entrega=fecha_entrega,
            descripcion=descripcion,
            fecha_ingreso=datetime.now()
        )
    session.add(aviso)
    session.commit()
    session.flush()
    
    #contactos
    for a in contactos:
        if a[1] != None:
            contacto = ContactarPor(
                            nombre=a[0],
                            identificador=a[1],
                            aviso_id=aviso.id
                        )
            session.add(contacto)
    session.commit()

    #fotos
    if fotos:
            for a in fotos:
                foto = Foto(
                    ruta_archivo='uploads/' + a,
                    nombre_archivo=a,
                    aviso_id=aviso.id
                )
                session.add(foto)
    session.commit()
    session.close()

