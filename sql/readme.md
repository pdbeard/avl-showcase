# How to back up the database

> Insert a bunch of stuff from Patrick about exporting the tables to csv. He has a script to combine different files into one.

## Manually export and re-import the image blob table

### Export via browser

To export a project image, navigate to the project details page, right click and save the image. This will save it with a filename like `06bdf9b1da8d8c192ed1345b6b56809a30c17e49.png`, which (minus the extension) is the SHA1 hash of the image contents. Crate uses this value as the id (or `digest`) in the blob table. 

### Export via command line

```bash
curl -sS '127.0.0.1:4200/_blobs/project_images/06bdf9b1da8d8c192ed1345b6b56809a30c17e49' > 06bdf9b1da8d8c192ed1345b6b56809a30c17e49.png
```

### Export all images at once via command line

> Insert some instructions here if it isn't covered above

### Import

Use `curl` to upload the image into the blob table (`project_images`). Note that the `@` character is required in the file name.

```bash
curl -isSX PUT '127.0.0.1:4200/_blobs/project_images/06bdf9b1da8d8c192ed1345b6b56809a30c17e49' --data-binary '@06bdf9b1da8d8c192ed1345b6b56809a30c17e49.png'
```
