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
    method: string,
    Energy_MEF_3p: number,
    Energy_MEF_Duplex: number,
    Energy_MEF_Seed: number,
    Energy_MEF_cons_local_target: number,
    Energy_MEF_cons_local_target_normalized: number,
    Energy_MEF_local_target: number,
    Energy_MEF_local_target_normalized: number
}