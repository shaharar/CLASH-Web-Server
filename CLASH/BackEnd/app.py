from flask import Flask, jsonify, request
from flask_cors import CORS
import pymssql
import pandas as pd
import functools

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


@app.route('/getMTIs')
def retrieve_info_by_search_inputs():
    mirna_name = None if request.args.get('mirnaName') == '' else request.args.get('mirnaName')
    mirna_seq = None if request.args.get('mirnaSeq') == '' else request.args.get('mirnaSeq')
    target_name = None if request.args.get('targetName') == '' else request.args.get('targetName')
    dataset = None if request.args.get('dataset') == '' else request.args.get('dataset')
    db_version = None if request.args.get('DBVersion') == '' else request.args.get('dataset')
    method_inputs = request.args.getlist('methodInputs')
    organism_inputs = request.args.getlist('organismInputs')
    mrna_region_inputs = request.args.getlist('mrnaRegionInputs')
    protocol_inputs = request.args.getlist('protocolInputs')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict = True)
    query1 = '''SELECT * FROM Pos_General_Info WHERE (%s IS NULL OR miRNA_name = %s)
    AND  (%s IS NULL OR miRNA_sequence = %s)
    AND  (%s IS NULL OR target_name = %s)
    AND (organism IN %s)'''
    query2 = 'SELECT * FROM Duplex_Method WHERE (method IN %s)'
    cursor.execute(query1,(mirna_name,mirna_name,mirna_seq,mirna_seq,target_name,target_name,tuple(organism_inputs),))
    result1 = cursor.fetchall()
    cursor.execute(query2,(tuple(method_inputs),))
    result2 = cursor.fetchall()
    df1 = pd.DataFrame(result1)
    df2 = pd.DataFrame(result2)
    df = df1.merge(df2,how='inner',on='mirTar_id')
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getInfoByMir')
def retrieve_pos_general_info_by_mir():
    mirna_name = request.args.get('mirnaName')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
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
def retrieve_features_by_category():
    feature_categories = request.args.getlist('featureInputs')
    dfs = []
    conn = pymssql.connect(server, user, password, database)
    cursor = conn.cursor(as_dict=True)
    for feature_category in feature_categories:
        query = 'SELECT * FROM ' + feature_category
        cursor.execute(query)
        result = cursor.fetchall()
        df = pd.DataFrame(result)
        dfs.append(df)
    features_df = functools.reduce(lambda df1,df2: pd.merge(df1,df2,on='mirTar_id'), dfs)
    jsonResult = features_df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getInfoByMirTarId')
def retrieve_pos_general_info_by_mirTar_id():
    mirTar_id = request.args.get('mirTarId')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT * FROM Pos_General_Info WHERE mirTar_id = %s', (mirTar_id))
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


@app.route('/getInfoByMethod')
def retrieve_Info_By_Method():
    method = request.args.get('method')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT mirTar_id FROM Duplex_Method WHERE method = %s',method)
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


if __name__ == "__main__":
    app.run(debug=True)


