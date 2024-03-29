from flask import Flask, jsonify, request
from flask_cors import CORS
import pymssql
import pandas as pd
import functools

from sklearn.decomposition import PCA
import pickle as pk
from pandas import DataFrame
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
import base64


app = Flask(__name__)
CORS(app)

# DB connection parameters
server = '132.72.23.88'
user = 'MirTar'
password = 'Yhsa2020'
database = 'MirTarFeaturesDB'

# variables 
# maintains filtered search results
search_results = pd.DataFrame()
# maintains original search results
original_search_results = pd.DataFrame()

# retrieves MTIs IDs by request arguments
@app.route('/getMTIs')
def retrieve_info_by_search_inputs():
    retrieve_search_results()
    global original_search_results
    original_search_results = search_results
    jsonResult = search_results.to_json(orient='records')
    return jsonResult

# retrieves all the features of given MTIs according to given categories 
@app.route('/getFeaturesByCategory')
def retrieve_features_by_category_for_download():
    feature_categories = None if request.args.get('featureInputs') == '' else request.args.get('featureInputs').split(',')
    if (search_results.empty):
        result_df = pd.DataFrame()
    else:
        result_df = retrieve_features_by_categories(feature_categories)
    jsonResult = result_df.to_json(orient='records')
    return jsonResult

# executes queries according to requested feature categories and returns a dataframe consists of the suitable information regarding given MTIs
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
        # iterates over feature categories and retrieves relevant data from the suitable table according to given MTIs
        for feature_category in feature_categories:
            query = 'SELECT * FROM ' + feature_category + ' WHERE (mirTar_id IN %s)'
            cursor.execute(query,(tuple(mirtar_id_list),))
            result = cursor.fetchall()
            category_df = pd.DataFrame(result)
            # remove duplicate column 'method'
            category_df = category_df.drop(columns=['method'])
            dfs.append(category_df)
        features_df = functools.reduce(lambda df1,df2: pd.merge(df1,df2,how='inner',on='mirTar_id'), dfs)
        result_df = pd.merge(general_info_df,features_df,how='inner',on='mirTar_id')
        conn.close()
    return result_df

# retrieves MTIs general info details according to a given ID
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

# retrieves relevant MTIs IDs according to given filter values
@app.route('/getMTIsByFilterInputs')
def retrieve_info_by_filter_inputs():
    global search_results
    seed_type = 'True' if request.args.get('seedType') == 'Canonic' else 'False' if request.args.get('seedType') == 'Non Canonic' else None
    from_base_pairs = None if request.args.get('fromBasePairs') == '' else int(request.args.get('fromBasePairs'))
    to_base_pairs = None if request.args.get('toBasePairs') == '' else int(request.args.get('toBasePairs'))
    # checks whether all filter values are none. If so, intersect results maintains original search results
    if (seed_type is None and from_base_pairs is None and to_base_pairs is None):
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
        # checks whether there was no match found to the given filter values 
        if(filter_results.empty):
            intersect_results = pd.DataFrame()
        else:
            intersect_results = pd.merge(original_search_results, filter_results, how='inner', on=['mirTar_id'])
    search_results = intersect_results
    jsonResult = search_results.to_json(orient='records')   
    return jsonResult

# retrieves all the features related to a given feature category of a specific MTI according to a given ID
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

# retrieves base64 encoded pca and seed type plots of MTIs results
@app.route('/getDataVisualization')
def get_data_visualization():
    encoded_img_list = []
    feature_categories = ["Features_Seed_Features","Features_Free_Energy", "Features_miRNA_Pairing",
                            "Features_mRNA_Composition", "Features_Site_Accessibility", 
                            "Features_Hot_Encoding_miRNA", "Features_Hot_Encoding_mRNA"]
    global full_df
    full_df = retrieve_features_by_categories(feature_categories)
    pca_file = Path("pca_v01.pkl")
    output_file = Path("outputs/db_pca.png")
    encoded_img_list.append(pca_plot(full_df, pca_file, output_file))
    output_file = Path("outputs/seed.png")
    encoded_img_list.append(seed_type_plot(full_df, output_file))
    jsonResult = json.dumps(encoded_img_list)   
    return jsonResult

def extract_pca_features(df: DataFrame) -> DataFrame:
    col_list = list(df.columns)
    all_features = col_list[col_list.index("Seed_match_compact_A"):]
    desired_features = [f for f in all_features if not str(f).startswith("HotPairing")]
    assert len(desired_features) == 490, "Wrong number of feature for PCA"
    return df[desired_features]


def pca_plot(df: DataFrame, pca_file_name: Path, output_file: Path):
    pca: PCA = pk.load(pca_file_name.open('rb'))
    df = extract_pca_features(df)
    x2d: DataFrame = DataFrame(pca.transform(df))
    fig = plt.figure(figsize=(16, 10))
    x_min_val = -30
    x_max_val = -15
    y_min_val = -15
    y_max_val = 2.5
    x_axis_range = [np.floor(x_min_val), np.ceil(x_max_val)]
    y_axis_range = [np.floor(y_min_val), np.ceil(y_max_val)]
    x2d.columns = ["2d-one", "2d-two"]
    plt.xlim(x_axis_range)
    plt.ylim(y_axis_range)
    sns.scatterplot(
        x="2d-one", y="2d-two",
        palette=sns.color_palette("hls", 10),
        data=x2d,
        legend=False,
        alpha=0.3
    )
    # Set x-axis label
    plt.xlabel('')
    # Set y-axis label
    plt.ylabel('')
    plt.savefig(output_file, format="png", bbox_inches='tight')

 # encodes plot output to base64 representation
    with open("outputs/db_pca.png", "rb") as imageFile:
        str = base64.b64encode(imageFile.read())
        base64_str = "data:image/png;base64, " + str.decode('utf-8')
        return base64_str

def seed_type_plot(d: DataFrame, output_file: Path):
    res_df = pd.DataFrame()
    p_canonic = d[d['canonic_seed'] == 'True']['canonic_seed']
    p_non_canonic = d[d['canonic_seed'] == 'False']['canonic_seed']
    p_10 = d[d["num_of_pairs"] <= 10]
    p_11_16 = d[(d["num_of_pairs"] >= 11) & (d["num_of_pairs"] <= 16)]
    p_17 = d[d["num_of_pairs"] >= 17]
    res_df.loc["Canonic seed", "p_10"] = len(set(p_canonic.index).intersection(set(p_10.index)))
    res_df.loc["Canonic seed", "p_11_16"] = len(set(p_canonic.index).intersection(set(p_11_16.index)))
    res_df.loc["Canonic seed", "p_17"] = len(set(p_canonic.index).intersection(set(p_17.index)))
    res_df.loc["Non-canonic seed", "p_10"] = len(set(p_non_canonic.index).intersection(set(p_10.index)))
    res_df.loc["Non-canonic seed", "p_11_16"] = len(set(p_non_canonic.index).intersection(set(p_11_16.index)))
    res_df.loc["Non-canonic seed", "p_17"] = len(set(p_non_canonic.index).intersection(set(p_17.index)))
    res_df = res_df.astype("int")
    fig, ax = plt.subplots()

    my_colors = list(["#34495e", "#e74c3c", "#92CA91"])
    res_df.plot(kind='bar', color=my_colors)
    plt.legend(["Low density", "Medium density", "High density"],
               loc='upper left', bbox_to_anchor=(1, 1), ncol=1)
    plt.xticks(rotation=0)
    plt.savefig(output_file, format="png", bbox_inches='tight')

# encodes plot output to base64 representation
    with open("outputs/seed.png", "rb") as imageFile:
        str = base64.b64encode(imageFile.read())
        base64_str = "data:image/png;base64, " + str.decode('utf-8')
        return base64_str

# retrieves calculated MTIs results statistics
@app.route('/getStatistics')
def get_statistics():
    statistics_results = df_statistics(full_df)
    statistics_results = statistics_results.replace("\"BASEPAIR_25%\":", "\"BASEPAIR_25\":")
    statistics_results = statistics_results.replace("\"BASEPAIR_50%\":", "\"BASEPAIR_50\":")
    statistics_results = statistics_results.replace("\"BASEPAIR_75%\":", "\"BASEPAIR_75\":")
    return statistics_results
    

# calculates MTIs results statistics
def df_statistics(d: DataFrame):
    result = {}
    result["NUM_OF_INTERACTIONS"] = len(d)
    result["NUM_OF_UNIQUE_MIRNA_SEQUENCES"] = len(d["miRNA_sequence"].unique())
    p_canonic = d[d['canonic_seed'] == 'True']['canonic_seed']
    result["NUM_OF_CANONIC_INTERACTIONS"] = len(p_canonic)
    p_non_canonic = d[d['canonic_seed'] == 'False']['canonic_seed']
    result["NUM_OF_NON_CANONIC_INTERACTIONS"] = len(p_non_canonic)
    basepair_describe = d["num_of_pairs"].describe()
    for i in basepair_describe.index:
        if i=='count':
            continue
        result[f"BASEPAIR_{i.upper()}"] = basepair_describe[i]
    return json.dumps(result)

# retrives MTIs IDs by search fields values and updates 'search_results' accordingly
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

# run app (host='0.0.0.0', port=8155)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8155)

