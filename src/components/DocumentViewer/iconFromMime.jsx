import { faFileImage , faFileAudio, faFileVideo, faFilePdf, faFileWord, faFileExcel, faFilePowerpoint, faFileAlt, faFileCode, faFileArchive, faFile} from "@fortawesome/free-solid-svg-icons"
import mime from 'mime-types'

function getFontAwesomeIconFromMIME(mimeType) {
  // List of official MIME Types: http://www.iana.org/assignments/media-types/media-types.xhtml
  var icon_classes = {
    // Media
    image: faFileImage,
    audio: faFileAudio,
    video: faFileVideo,
    // Documents
    "application/pdf": faFilePdf,
    "application/msword": faFileWord,
    "application/vnd.ms-word": faFileWord,
    "application/vnd.oasis.opendocument.text": faFileWord,
    "application/vnd.openxmlformats-officedocument.wordprocessingml":
      faFileWord,
    "application/vnd.ms-excel": faFileExcel,
    "application/vnd.openxmlformats-officedocument.spreadsheetml":
      faFileExcel,
    "application/vnd.oasis.opendocument.spreadsheet": faFileExcel,
    "application/vnd.ms-powerpoint": faFilePowerpoint,
    "application/vnd.openxmlformats-officedocument.presentationml":
      faFilePowerpoint,
    "application/vnd.oasis.opendocument.presentation": faFilePowerpoint,
    "text/plain": faFileAlt,
    "text/html": faFileCode,
    "application/json": faFileCode,
    // Archives
    "application/gzip": faFileArchive,
    "application/zip": faFileArchive,
  }

  for (var key in icon_classes) {
    if (icon_classes.hasOwnProperty(key)) {
      if (mimeType.search(key) === 0) {
        // Found it
        return icon_classes[key]
      }
    } else {
      return faFile
    }
  }
}

function getExtensionFromMIME(mimeType) {
  return mime.extension(mimeType)
}
export { getFontAwesomeIconFromMIME, getExtensionFromMIME }