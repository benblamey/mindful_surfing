@ECHO === Don't forget to bump the version number in the manifest.json! ===

@ECHO === Don't forget to update the zip_list !! ===

SET PATH=%PATH%;C:\Program Files\7-Zip

del mindful_surfing.zip
7z a -i@zip_list mindful_surfing.zip	