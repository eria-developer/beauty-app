const uploadAvatar = async (uri) => {
    // console.log("Starting avatar upload process");
    try {
      if (!uri?.startsWith("file://")) {
        // console.log("Invalid file URI");
        return null;
      }

      // console.log("Reading image file as base64");
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `avatar-${randomUUID()}.jpg`;
      const contentType = "image/jpeg";

      // console.log("Uploading file to Supabase storage");
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, decode(base64), { contentType });

      if (error) {
        console.error("Supabase storage error:", error);
        throw error;
      }

      // console.log("File uploaded successfully, data:", data);

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // console.log("Public URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error in uploadAvatar:", error);
      return null;
    }
  };



  const handleSubmit = async () => {
    if (!session?.user?.id) {
      Toast.show({
        type: "error",
        text1: `User is not logged in`,
        visibilityTime: 1000,
      });
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = profile?.avatar_url;
      if (avatar && avatar !== profile?.avatar_url) {
        avatarUrl = await uploadAvatar(avatar);
        if (!avatarUrl) {
          throw new Error("Failed to upload avatar");
        }
      }

      // Profile update
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          address: address,
          avatar_url: avatarUrl,
        })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      // Email update if changed
      if (email !== session.user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        });
        if (emailError) throw emailError;
      }

      await updateProfile();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Profile updated Successfully`,
      });
      router.back();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error?.message}`,
      });
    } finally {
      setLoading(false);
    }
  };