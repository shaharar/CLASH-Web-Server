from flask import Flask, jsonify, request
from flask_cors import CORS
import pymssql
import pandas as pd

app = Flask(__name__)
CORS(app)

#app.config['MSSQL_HOST'] = '132.72.64.102'
#app.config['MSSQL_USER'] = 'MirTar'
#app.config['MSSQL_PASSWORD'] = 'Yhsa2020'
#app.config['MSSQL_DB'] = 'MirTarFeaturesDB'

server = '132.72.64.102'
user = 'MirTar'
password = 'Yhsa2020'
database = 'MirTarFeaturesDB'


@app.route('/getInfoByMir')
def retrieve_pos_general_info_by_mir():
    mirna_name = request.args.get('mirnaName')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict = True)
    cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s',mirna_name)
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getInfoByOrganism')
def retrieve_pos_general_info_by_organism():
    organism = request.args.get('organism')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE organism = %s',organism)
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getInfoByTarget')
def retrieve_pos_general_info_by_target():
    target_name = request.args.get('targetName')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE target_name = %s',target_name)
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getInfoByMirTar')
def retrieve_pos_general_info_by_mir_tar_pair():
    mirna_name = request.args.get('mirnaName')
    target_name = request.args.get('targetName')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s AND target_name = %s', (mirna_name,target_name))
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getFeaturesByCategory')
def retrieve_features_by_category(mirTar_id, feature_category):
    conn = pymssql.connect(server, user, password, database)
    cursor = conn.cursor(as_dict=True)
    # mir_tar_list = []
    result = []
    features = {'free_energy':['Features_Free_Energy'],'mrna_composition':['Features_mRNA_Composition'],'seed_features':['Features_Seed_Features'],
                'mirna_pairing':['Features_miRNA_Pairing'],'site_accessibility':['Features_Site_Accessibility'],
                'hot_encoding_mirna':['Features_Hot_Encoding_miRNA'],'hot_encoding_mrna':['Features_Hot_Encoding_mRNA']}
    feature_category_table = features[feature_category]
    #cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s AND target_name = %s', mirna_name,
    #               target_name)
    # for row in cursor:
    #     mir_tar_list.append(row)
    # for mir_tar_id in mir_tar_list:
    cursor.execute('SELECT * FROM ' + feature_category_table + ' WHERE mirTar_id = "%s', mirTar_id)
    for row in cursor:
        result.append(row)
    conn.close()
    return result


@app.route('/getInfoByMirTarId')
def retrieve_pos_general_info_by_mirTar_id():
    mirTar_id = request.args.get('mirTar_id')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT * FROM Pos_General_Info WHERE mirTar_id = %s', (mirTar_id))
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


def retrieve_duplex_by_mir_tar_pair():
    mirna_name = request.args.get('mirnaName')
    target_name = request.args.get('targetName')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    mir_tar_list = []
    result = []
    cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s AND target_name = %s', mirna_name,
                   target_name)
    for row in cursor:
        mir_tar_list.append(row)
    for mir_tar_id in mir_tar_list:
        cursor.execute('SELECT * FROM Duplex_Method WHERE mirTar_id = "%s',mir_tar_id)
        for row in cursor:
            result.append(row)
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult

if __name__ == "__main__":
    app.run(debug=True)


