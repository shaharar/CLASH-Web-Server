import pandas as pd
import pymssql
from sqlalchemy import create_engine

# server = 'ISE-PROJ-SQL'
# user = 'MirTar'
# password = 'Yhsa2020'
# database = 'MirTarFeaturesDB'


def read_csv_file(path):
    data = pd.read_csv(path)
    return data


def connect_to_database():
    engine = create_engine('mssql+pymssql://MirTar:Yhsa2020@132.72.64.102:1433/MirTarFeaturesDB')
    return engine


def insert_into_pos_general_info(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    last_column = col_list.index("full_mrna")
    table_data.drop(columns=col_list[last_column + 1:], inplace=True)
    columns = ['Unnamed: 0', 'microRNA_name', 'mRNA_name', 'Organism', 'miRNA sequence', 'target sequence', 'mRNA_start', 'mRNA_end', 'full_mrna', 'Source', 'GI_ID', 'number of reads']
    table_data = table_data.ix[:, columns]
    new_columns = ['mirTar_id', 'miRNA_name', 'target_name', 'organism', 'miRNA_sequence', 'target_sequence', 'mRNA_start', 'mRNA_end', 'full_mRNA', 'source', 'line', 'num_of_reads']
    table_data.columns = new_columns
    table_data.astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Pos_General_Info",
                       con=engine,
                       if_exists='append',
                       index=False,
                       chunksize=500)


def insert_into_features_seed_features(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("Seed_match_compact_A")
    last_column = col_list.index("miRNAMatchPosition_1")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Features_Seed_Features",
                   con=engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


def insert_into_features_free_energy(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("Energy_MEF_3p")
    last_column = col_list.index("Acc_P10_10th")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql("Features_Free_Energy",
                   engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


def insert_into_features_hot_encoding_miRNA(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("HotPairingMirna_he_P1_L1")
    last_column = col_list.index("Energy_MEF_3p")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Features_Hot_Encoding_miRNA",
                   con=engine,
                   if_exists='append',
                   index=False,
                   chunksize=1000)


def insert_into_features_hot_encoding_mRNA(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("HotPairingMRNA_he_P1_L1")
    last_column = col_list.index("HotPairingMirna_he_P1_L1")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Features_Hot_Encoding_mRNA",
                   con=engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


def insert_into_features_site_accessibility(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("Acc_P10_10th")
    last_column = col_list.index("Acc_P9_9th")
    table_data = table_data.iloc[:, first_column:last_column + 1]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Features_Site_Accessibility",
                   con=engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


def insert_into_features_miRNA_pairing(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("miRNAMatchPosition_1")
    last_column = col_list.index("MRNA_Dist_to_start")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Features_miRNA_Pairing",
                   con=engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


def insert_into_features_mRNA_composition(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    first_column = col_list.index("MRNA_Dist_to_start")
    last_column = col_list.index("HotPairingMRNA_he_P1_L1")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql(name="Features_mRNA_Composition",
                   con=engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


def insert_into_duplex_method(data):
    table_data = data.copy()
    col_list = list(table_data.columns)
    mirTar_id_column = table_data['Unnamed: 0']
    num_of_pairs_column = table_data['num_of_pairs']
    first_column = col_list.index("i_0")
    last_column = col_list.index("i_23")
    table_data = table_data.iloc[:, first_column:last_column]
    table_data.insert(loc=0, column='mirTar_id', value=mirTar_id_column)
    table_data.insert(loc=1, column='method', value='Vienna')
    table_data.insert(loc=2, column='num_of_pairs', value=num_of_pairs_column)
    table_data['mirTar_id'].astype(str)

    engine = connect_to_database()
    table_data.to_sql("Duplex_Method",
                   engine,
                   if_exists='append',
                   index=False,
                   chunksize=500)


################################### Main #####################################

############################   Positive Data   ###############################

# path = 'C:\\Users\\User\\Downloads\\Preprocessed Data\\mouse_dataset2_duplex_positive_feature.csv'

pos_paths_list = ['C:\\Users\\User\\Downloads\\Preprocessed Data\\cattle_dataset1_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\celegans_dataset1_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\celegans_dataset2_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\human_dataset1_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\human_dataset2_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\human_dataset3_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\mouse_dataset1_duplex_positive_feature.csv',
                  'C:\\Users\\User\\Downloads\\Preprocessed Data\\mouse_dataset2_duplex_positive_feature.csv']

for path in pos_paths_list:
    data = read_csv_file(path)
    # adding 'P' before each mirTar id
    pk_column = []
    for id in data['Unnamed: 0']:
        pk_column.append('P' + str(id))
    data['Unnamed: 0'] = pk_column
    #print(data.head())
    insert_into_pos_general_info(data)
    insert_into_features_seed_features(data)
    insert_into_features_free_energy(data)
    insert_into_features_hot_encoding_miRNA(data)
    insert_into_features_hot_encoding_mRNA(data)
    insert_into_features_site_accessibility(data)
    insert_into_features_miRNA_pairing(data)
    insert_into_features_mRNA_composition(data)
    insert_into_duplex_method(data)
    #print("OK")


