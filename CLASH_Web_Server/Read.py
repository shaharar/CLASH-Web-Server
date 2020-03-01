from os import environ

import pandas as pd
import pymssql
from sqlalchemy import create_engine

from sqlalchemy.types import Integer, Text, String, DateTime

server = 'ISE-PROJ-SQL'
user = 'MirTar'
password = 'Yhsa2020'
database = 'MirTarFeaturesDB'


def read_csv_file(path):
    data = pd.read_csv(path)
    return data


# def insert_into_pos_general_info(data):
#     table_data = data
#     col_list = list(table_data.columns)
#     last_column = col_list.index("full_mrna")
#     table_data.drop(columns=col_list[last_column + 1:], inplace=True)
#     print(table_data.columns)
#     conn = pymssql.connect(server, user, password, database)
#     cursor = conn.cursor()
#     #cursor.execute("INSERT INTO Pos_General_Info (mirTar_id, miRNA_name, target_name, organism, miRNA_sequence,target_sequence, mRNA_start, mRNA_end, full_mRNA, source, line, num_of_reads) VALUES ( 'a', 'a','a','a','a','a','a','a','a','a','a','a')")
#     for index, row in table_data.iterrows():
#         record = [str(row['Unnamed: 0']),str(row['microRNA_name']),str(row['mRNA_name']),str(row['Organism']),str(row['miRNA sequence']),str(row['target sequence']),str(row['mRNA_start']),str(row['mRNA_end']),str(row['full_mrna']),str(row['Source']),str(row['GI_ID']),str(row['number of reads'])]
#         query =  "INSERT INTO Pos_General_Info (mirTar_id, miRNA_name, target_name, organism, miRNA_sequence,target_sequence, mRNA_start, mRNA_end, full_mRNA, source, line, num_of_reads) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",record
#         cursor.execute(query)
#         print(query)
#     conn.commit()
#     cursor.close()
#     conn.close()

# VALUES ('"P+i[0]+"','"+i[4]+"','"+i[8]+"','"+i[2]+"','"+i[5]+"','"+i[6]+"','"+i[9]+"','"+i[10]+"'
# ,'"+i[11]+"','"+i[1]+"','"+i[3]+"','"+i[7]+"')


def connect_to_database():
    db_URI = environ.get('mssql+pymssql://scott:tiger@hostname:port/MirTarFeaturesDB') # TODO - change URI
    engine = create_engine(db_URI)
    return engine



def insert_into_pos_general_info(data):
    table_data = data
    col_list = list(table_data.columns)
    last_column = col_list.index("full_mrna")
    table_data.drop(columns=col_list[last_column + 1:], inplace=True)

    columns = ['Unnamed: 0', 'microRNA_name', 'mRNA_name', 'Organism', 'miRNA sequence', 'target sequence', 'mRNA_start', 'mRNA_end', 'full_mrna', 'Source', 'GI_ID', 'number of reads']
    print (columns)

    table_data = table_data.ix[:, columns]
    new_columns = ['mirTar_id', 'miRNA_name', 'target_name', 'organism', 'miRNA_sequence', 'target_sequence', 'mRNA_start', 'mRNA_end', 'full_mRNA', 'source', 'line', 'num_of_reads']
    table_data.columns = new_columns
    print (table_data.head())

    engine = connect_to_database()
    table_data.to_sql("Pos_General_Info",
                       engine,
                       if_exists='replace',
                       schema='public',
                       index=False,
                       chunksize=500)



def insert_into_features_seed_features(data):
    table_data = data
    col_list = list(table_data.columns)
    first_column = col_list.index("Seed_match_compact_A")
    last_column = col_list.index("miRNAMatchPosition_1")
    table_data = table_data.iloc[:, first_column:last_column]
  #  print(table_data.columns)

    engine = connect_to_database()
    table_data.to_sql("Features_Seed_Features",
                   engine,
                   if_exists='replace',
                   schema='public',
                   index=False,
                   chunksize=500)



def insert_into_features_free_energy(data):
    table_data = data
    col_list = list(table_data.columns)
    first_column = col_list.index("Energy_MEF_3p")
    last_column = col_list.index("Acc_P10_10th")
    table_data = table_data.iloc[:, first_column:last_column]
    print(table_data.columns)

    engine = connect_to_database()
    table_data.to_sql("Features_Free_Energy",
                   engine,
                   if_exists='replace',
                   schema='public',
                   index=False,
                   chunksize=500)


path = 'C:\\Users\\User\\Downloads\\mouse_dataset2_duplex_positive_feature.csv'
data = read_csv_file(path)
#print(data.head())
insert_into_pos_general_info(data)
#insert_into_features_seed_features(data)
#insert_into_features_free_energy(data)



# def read_feature_csv(f: Path, expected_num_of_features=580) -> (DataFrame, ndarray):
#     data: DataFrame = pd.read_csv(f)
#     y = data.Label.ravel()
#     col_list = list(data.columns)
#     feature_index = col_list.index("Seed_match_compact_A")
#     data.drop(columns=col_list[:feature_index], inplace=True)
#
#     assert len(data.columns) == expected_num_of_features, f"""Read error. Wrong number of features.
#     Read: {len(data.columns)}
#     Expected: {expected_num_of_features}"""
#     return data, y



