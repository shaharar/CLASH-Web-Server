export interface IMTI {
    mirTar_id: string,
    miRNA_name: string, 
    target_name: string,
    organism: string, 
    miRNA_sequence: string,
    target_sequence: string,
    mRNA_start: string,
    mRNA_end: string,
    full_mRNA: string,
    source: string,
    line: string,
    num_of_reads: number
}

export interface FreeEnergyFeatures {
    mirTar_id: string,
    Energy_MEF_3p: number,
    Energy_MEF_Duplex: number,
    Energy_MEF_Seed: number,
    Energy_MEF_cons_local_target: number,
    Energy_MEF_cons_local_target_normalized: number,
    Energy_MEF_local_target: number,
    Energy_MEF_local_target_normalized: number
}

export interface HotEncodingMirnaFeatures {
    mirTar_id: string,
    HotPairingMirna_he_P1_L1: number,
    HotPairingMirna_he_P1_L2: number,
    HotPairingMirna_he_P1_L3: number,
    HotPairingMirna_he_P1_L4: number,
    HotPairingMirna_he_P1_L5: number,
    HotPairingMirna_he_P2_L1: number,
    HotPairingMirna_he_P2_L2: number

}

export interface HotEncodingMrnaFeatures {
    mirTar_id: string,
    HotPairingMRNA_he_P1_L1: number,
    HotPairingMRNA_he_P1_L2: number,
    HotPairingMRNA_he_P1_L3: number,
    HotPairingMRNA_he_P1_L4: number,
    HotPairingMRNA_he_P1_L5: number,
    HotPairingMRNA_he_P2_L1: number,
    HotPairingMRNA_he_P2_L2: number
}

export interface MirnaPairingFeatures {
    mirTar_id: string,
    miRNAMatchPosition_1: number,
    miRNAMatchPosition_10: number,
    miRNAMatchPosition_11: number,
    miRNAMatchPosition_12: number,
    miRNAMatchPosition_13: number,
    miRNAMatchPosition_14: number,
    miRNAMatchPosition_15: number
}

export interface MrnaCompositionFeatures {
    mirTar_id: string,
    MRNA_Dist_to_start: number,
    MRNA_Dist_to_end: number,
    MRNA_Target_AA_comp: number,
    MRNA_Target_AC_comp: number,
    MRNA_Target_AG_comp: number,
    MRNA_Target_AU_comp: number,
    MRNA_Target_A_comp: number
}

export interface SeedFeatures {
    mirTar_id: string,
    Seed_match_compact_A: number,
    Seed_match_compact_GU_2_7: number,
    Seed_match_compact_GU_3_8: number,
    Seed_match_compact_GU_all: number,
    Seed_match_compact_bulge_mirna: number,
    Seed_match_compact_bulge_target: number,
    Seed_match_compact_interactions_2_7: number
}

export interface SiteAccessibility {
    mirTar_id: string,
    Acc_P10_10th: number,
    Acc_P10_1th: number,
    Acc_P10_2th: number,
    Acc_P10_3th: number,
    Acc_P10_4th: number,
    Acc_P10_5th: number,
    Acc_P10_6th: number
}