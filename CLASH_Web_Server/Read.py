import pandas as pd
import pymssql


server = 'ISE-PROJ-SQL'
user = 'MirTar'
password = 'Yhsa2020'
database = 'MirTarFeaturesDB'


def read_csv_file(path):
    data = pd.read_csv(path)
    return data


def insert_into_pos_general_info(data):
    table_data = data
    col_list = list(table_data.columns)
    last_column = col_list.index("full_mrna")
    table_data.drop(columns=col_list[last_column + 1:], inplace=True)
    print(table_data.columns)
    conn = pymssql.connect(server, user, password, database)
    cursor = conn.cursor()
    #cursor.execute("INSERT INTO Pos_General_Info (mirTar_id, miRNA_name, target_name, organism, miRNA_sequence,target_sequence, mRNA_start, mRNA_end, full_mRNA, source, line, num_of_reads) VALUES ( 'a', 'a','a','a','a','a','a','a','a','a','a','a')")
    for index, row in table_data.iterrows():
        record = [str(row['Unnamed: 0']),str(row['microRNA_name']),str(row['mRNA_name']),str(row['Organism']),str(row['miRNA sequence']),str(row['target sequence']),str(row['mRNA_start']),str(row['mRNA_end']),str(row['full_mrna']),str(row['Source']),str(row['GI_ID']),str(row['number of reads'])]
        query =  "INSERT INTO Pos_General_Info (mirTar_id, miRNA_name, target_name, organism, miRNA_sequence,target_sequence, mRNA_start, mRNA_end, full_mRNA, source, line, num_of_reads) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",record
        cursor.execute(query)
        print(query)
    conn.commit()
    cursor.close()
    conn.close()


# VALUES ('"P+i[0]+"','"+i[4]+"','"+i[8]+"','"+i[2]+"','"+i[5]+"','"+i[6]+"','"+i[9]+"','"+i[10]+"'
# ,'"+i[11]+"','"+i[1]+"','"+i[3]+"','"+i[7]+"')

path = 'd:\\documents\\users\\shaharar\\Downloads\\mouse_dataset2_duplex_positive_feature.csv'
data = read_csv_file(path)
insert_into_pos_general_info(data)



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