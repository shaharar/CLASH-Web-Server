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

server = '132.72.23.88'
user = 'MirTar'
password = 'Yhsa2020'
database = 'MirTarFeaturesDB'

search_results = pd.DataFrame()
original_search_results = pd.DataFrame()

@app.route('/getMTIs')
def retrieve_info_by_search_inputs():
    # global search_results   
    # search_results = retrieve_search_results()
    # print("search results in getMTIs:")
    # print(search_results)
    retrieve_search_results()
    global original_search_results
    original_search_results = search_results
    print(original_search_results)
    jsonResult = search_results.to_json(orient='records')
    return jsonResult

@app.route('/getFeaturesByCategory')
def retrieve_features_by_category_for_download():
    print("retrieve_features_by_category_for_download")
    # print(search_results)
    feature_categories = None if request.args.get('featureInputs') == '' else request.args.get('featureInputs').split(',')
    if (search_results.empty):
        result_df = pd.DataFrame()
    else:
        result_df = retrieve_features_by_categories(feature_categories)
    # print(result_df)
    jsonResult = result_df.to_json(orient='records')
    return jsonResult

def retrieve_features_by_categories(feature_categories):
    mirtar_id_list = search_results['mirTar_id'].tolist()
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict = True)
    query1 = '''SELECT * FROM Pos_General_Info WHERE (mirTar_id IN %s)'''
    cursor.execute(query1,(tuple(mirtar_id_list),))
    result1 = cursor.fetchall()
    query2 = 'SELECT * FROM Duplex_Method WHERE (mirTar_id IN %s)'
    cursor.execute(query2,(tuple(mirtar_id_list),))
    result2 = cursor.fetchall()
    df1 = pd.DataFrame(result1)
    df2 = pd.DataFrame(result2)
    if(df1.empty or df2.empty):
        general_info_df = pd.DataFrame()
    else:
        general_info_df = df1.merge(df2,how='inner',on='mirTar_id')
    if(feature_categories is None or search_results.empty):
        result_df = general_info_df
    elif(~search_results.empty):
        dfs = []
        for feature_category in feature_categories:
            query = 'SELECT * FROM ' + feature_category + ' WHERE (mirTar_id IN %s)'
            cursor.execute(query,(tuple(mirtar_id_list),))
            result = cursor.fetchall()
            category_df = pd.DataFrame(result)
            category_df = category_df.drop(columns=['method'])
            dfs.append(category_df)
        features_df = functools.reduce(lambda df1,df2: pd.merge(df1,df2,how='inner',on='mirTar_id'), dfs)
        print(features_df)
        result_df = pd.merge(general_info_df,features_df,how='inner',on='mirTar_id')
        conn.close()
    return result_df

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

@app.route('/getMTIsByFilterInputs')
def retrieve_info_by_filter_inputs():
    global search_results
    print("getMTIsByFilterInputs")
    seed_type = 'True' if request.args.get('seedType') == 'Canonic' else 'False' if request.args.get('seedType') == 'Non Canonic' else None
    print(seed_type)
    from_base_pairs = None if request.args.get('fromBasePairs') == '' else int(request.args.get('fromBasePairs'))
    to_base_pairs = None if request.args.get('toBasePairs') == '' else int(request.args.get('toBasePairs'))
    print(from_base_pairs)
    print(to_base_pairs)
    if (seed_type is None and from_base_pairs is None and to_base_pairs is None):
        print("None Filter Inputs")
        intersect_results = original_search_results
    else:
        conn = pymssql.connect(server,user,password,database)
        cursor = conn.cursor(as_dict=True)
        query = '''SELECT mirTar_id FROM Duplex_Method WHERE (%s IS NULL OR canonic_seed = %s)
                AND  ((%d IS NULL) OR (%d IS NULL) OR (num_of_pairs BETWEEN %d AND %d))'''
        cursor.execute(query,(seed_type,seed_type,from_base_pairs,to_base_pairs,from_base_pairs,to_base_pairs))
        results = cursor.fetchall()
        filter_results = pd.DataFrame(results)
        conn.close()
        if(filter_results.empty):
            intersect_results = pd.DataFrame()
        else:
            intersect_results = pd.merge(original_search_results, filter_results, how='inner', on=['mirTar_id'])
    # print(intersect_results)
    search_results = intersect_results
    # print(search_results)
    jsonResult = search_results.to_json(orient='records')   
    return jsonResult


@app.route('/getDataVisualization')
def get_statistics_and_visualization():
    print("enter get_statistics_and_visualization")
    feature_categories = ["Features_Free_Energy", "Features_Seed_Features", "Features_miRNA_Pairing",
                            "Features_mRNA_Composition", "Features_Site_Accessibility", 
                            "Features_Hot_Encoding_miRNA", "Features_Hot_Encoding_mRNA"]
    # is_filtered = request.args.get('isFiltered')
    # print(is_filtered)
    # if (is_filtered == 'false'):
    #     full_df = retrieve_features_by_categories(feature_categories, full_search_results)
    # else:
    #     full_df = retrieve_features_by_categories(feature_categories, filtered_search_results)
    full_df = retrieve_features_by_categories(feature_categories)
    # print(full_df)
    jsonResult = full_df.to_json(orient='records')   
    return jsonResult



def retrieve_search_results():
    mirna_name = None if request.args.get('mirnaName') == '' else request.args.get('mirnaName')
    mirna_seq = None if request.args.get('mirnaSeq') == '' else request.args.get('mirnaSeq')
    target_name = None if request.args.get('targetName') == '' else request.args.get('targetName')
    dataset = None if (request.args.get('dataset') == 'All' or request.args.get('dataset') == '')  else request.args.get('dataset')
    db_version = None if request.args.get('DBVersion') == '' else request.args.get('db_version')
    method_inputs = request.args.get('methodInputs').split(',')
    organism_inputs = request.args.get('organismInputs').split(',')
    mrna_region_inputs = request.args.get('mrnaRegionInputs').split(',')
    protocol_inputs = request.args.get('protocolInputs').split(',')
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict = True)
    query1 = '''SELECT mirTar_id FROM Pos_General_Info WHERE (%s IS NULL OR miRNA_name = %s)
    AND  (%s IS NULL OR miRNA_sequence = %s)
    AND  (%s IS NULL OR target_name = %s)
    AND  (%s IS NULL OR db_version = %s)
    AND  (%s IS NULL OR source = %s)
    AND (organism IN %s)'''
    query2 = 'SELECT mirTar_id FROM Duplex_Method WHERE (method IN %s)'
    cursor.execute(query1,(mirna_name,mirna_name,mirna_seq,mirna_seq,target_name,target_name,db_version,db_version,dataset,dataset,tuple(organism_inputs),))
    result1 = cursor.fetchall()
    cursor.execute(query2,(tuple(method_inputs),))
    result2 = cursor.fetchall()
    df1 = pd.DataFrame(result1)
    df2 = pd.DataFrame(result2)
    if(df1.empty or df2.empty):
        df = pd.DataFrame()
    else:
      df = df1.merge(df2,how='inner',on='mirTar_id')
    conn.close()
    global search_results
    search_results = df
    # return search_results

@app.route('/getFeatures')
def retrieve_features():
    mirTar_id =  request.args.get('mirTarId')
    feature_Category = request.args.get('featureCategory')
    conn = pymssql.connect(server, user, password, database)
    cursor = conn.cursor(as_dict=True)
    cursor.execute('SELECT * FROM ' + feature_Category+ ' WHERE mirTar_id = %s', (mirTar_id))
    result = cursor.fetchall()
    df = pd.DataFrame(result)
    jsonResult = df.to_json(orient='records')
    conn.close()
    return jsonResult


if __name__ == "__main__":
    app.run(debug=True)



# @app.route('/getInfoByMir')
# def retrieve_pos_general_info_by_mir():
#     mirna_name = request.args.get('mirnaName')
#     conn = pymssql.connect(server,user,password,database)
#     cursor = conn.cursor(as_dict=True)
#     cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s',mirna_name)
#     result = cursor.fetchall()
#     df = pd.DataFrame(result)
#     jsonResult = df.to_json(orient='records')
#     conn.close()
#     return jsonResult
    

# @app.route('/getInfoByOrganism')
# def retrieve_pos_general_info_by_organism():
#     organism = request.args.get('organism')
#     conn = pymssql.connect(server,user,password,database)
#     cursor = conn.cursor(as_dict=True)
#     cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE organism = %s',organism)
#     result = cursor.fetchall()
#     df = pd.DataFrame(result)
#     jsonResult = df.to_json(orient='records')
#     conn.close()
#     return jsonResult


# @app.route('/getInfoByTarget')
# def retrieve_pos_general_info_by_target():
#     target_name = request.args.get('targetName')
#     conn = pymssql.connect(server,user,password,database)
#     cursor = conn.cursor(as_dict=True)
#     cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE target_name = %s',target_name)
#     result = cursor.fetchall()
#     df = pd.DataFrame(result)
#     jsonResult = df.to_json(orient='records')
#     conn.close()
#     return jsonResult


# @app.route('/getInfoByMirTar')
# def retrieve_pos_general_info_by_mir_tar_pair():
#     mirna_name = request.args.get('mirnaName')
#     target_name = request.args.get('targetName')
#     conn = pymssql.connect(server,user,password,database)
#     cursor = conn.cursor(as_dict=True)
#     cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s AND target_name = %s', (mirna_name,target_name))
#     result = cursor.fetchall()
#     df = pd.DataFrame(result)
#     jsonResult = df.to_json(orient='records')
#     conn.close()
#     return jsonResult