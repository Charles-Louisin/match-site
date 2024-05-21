

export async function uploadUserProfilImage(
    supabase,
    userId,
    file,
    bucket,
    profilColumn
) {

    return new Promise( async (resolve, reject) => {
        const newName = Date.now() + file.name;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(newName, file)



        if (error) throw error;
        if (data) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL + `/storage/v1/object/public/${bucket}/` + data.path;
            supabase.from('profiles')
                .update({
                    [profilColumn]: url,
                })
                .eq('id', userId)
                .then(({ error }) => {
                    if (!error) {
                        resolve();
                    } else {
                        throw error;
                    }
                })
        }
    })


}