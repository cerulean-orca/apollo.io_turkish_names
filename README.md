For any users of Apollo.io doing outbound in the Turkish B2B field - an issue that slows them down is the broken name format for contact names. 
For example, a common Turkish name "Görkem" is written as "Goerkem", or "Aslı" as "Asli"
Also, the need to add the Mr. or Mrs. to each name manually. You must create a manual field called "Hitap", so you can add dynamic updating in sequences.

I've written a Google Apps Script, so you can export contacts and prepare them and import them back into your sequences.
You will need to download a directory of Turkish names for this script to work, that you can find at:
https://gist.github.com/kvtoraman/f300ae077828c6940d96cd3b19181b3f
You can then create a sheet called "NamesDatabase" and append these names to it.

This will help add the honorific "Bey" or "Hanım"
A percentage of Turkish names are unisex, so you will have to verify some by checking their Linkedin profiles.
Still, this will cut down your time by at least one half!

You will also need to create a Dictionary sheet, for the aforementioned "Goerkem" to "Görkem" conversions.
You can find it in this repo as "Dictionary.csv"

Godspeed!
