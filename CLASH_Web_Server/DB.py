import pymssql


server = 'ISE-PROJ-SQL'
user = 'MirTar'
password = 'Yhsa2020'
database = 'MirTarFeaturesDB'


def retrieve_pos_general_info_by_mir(mirna_name):
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict = True)
    result = []
    cursor.execute('SELECT * FROM Pos_General_Info WHERE miRNA_name = %s',mirna_name)
    for row in cursor:
        result.append(row)
    conn.close()
    return result


def retrieve_pos_general_info_by_organism(organism):
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    result = []
    cursor.execute('SELECT * FROM Pos_General_Info WHERE organism = %s',organism)
    for row in cursor:
        result.append(row)
    conn.close()
    return result


def retrieve_pos_general_info_by_target(target_name):
    conn = pymssql.connect(server,user,password,database)
    cursor = conn.cursor(as_dict=True)
    result = []
    cursor.execute('SELECT * FROM Pos_General_Info WHERE target_name = %s',target_name)
    for row in cursor:
        result.append(row)
    conn.close()
    return result


def retrieve_duplex_by_mir_tar_pair(mirna_name,target_name):
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
    conn.close()
    return result


def retrieve_features_by_category(mirna_name,target_name,feature_category):
    conn = pymssql.connect(server, user, password, database)
    cursor = conn.cursor(as_dict=True)
    mir_tar_list = []
    result = []
    features = {'free_energy':['Features_Free_Energy'],'mrna_composition':['Features_mRNA_Composition'],'seed_features':['Features_Seed_Features'],
                'mirna_pairing':['Features_miRNA_Pairing'],'site_accessibility':['Features_Site_Accessibility'],
                'hot_encoding_mirna':['Features_Hot_Encoding_miRNA'],'hot_encoding_mrna':['Features_Hot_Encoding_mRNA']}
    feature_category_table = features[feature_category]
    cursor.execute('SELECT mirTar_id FROM Pos_General_Info WHERE miRNA_name = %s AND target_name = %s', mirna_name,
                   target_name)
    for row in cursor:
        mir_tar_list.append(row)
    for mir_tar_id in mir_tar_list:
        cursor.execute('SELECT * FROM ' + feature_category_table + ' WHERE mirTar_id = "%s', mir_tar_id)
        for row in cursor:
            result.append(row)
    conn.close()
    return result





