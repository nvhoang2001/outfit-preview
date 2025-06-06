import { Platform } from 'react-native';
import { LibraryDirectoryPath, PicturesDirectoryPath } from '@dr.pogodin/react-native-fs';

const mimeTypesExtensionsMap: Record<string, string[]> = {
  'text/html': ['html', 'htm', 'shtml'],
  'text/css': ['css'],
  'text/xml': ['xml'],
  'image/gif': ['gif'],
  'image/jpeg': ['jpeg', 'jpg'],
  'application/x-javascript': ['js'],
  'application/atom+xml': ['atom'],
  'application/rss+xml': ['rss'],
  'text/mathml': ['mml'],
  'text/plain': ['txt'],
  'text/vnd.sun.j2me.app-descriptor': ['jad'],
  'text/vnd.wap.wml': ['wml'],
  'text/x-component': ['htc'],
  'image/png': ['png'],
  'image/tiff': ['tif', 'tiff'],
  'image/vnd.wap.wbmp': ['wbmp'],
  'image/x-icon': ['ico'],
  'image/x-jng': ['jng'],
  'image/x-ms-bmp': ['bmp'],
  'image/svg+xml': ['svg'],
  'image/webp': ['webp'],
  'application/java-archive': ['jar', 'war', 'ear'],
  'application/mac-binhex40': ['hqx'],
  'application/msword': ['doc'],
  'application/pdf': ['pdf'],
  'application/postscript': ['ps', 'eps', 'ai'],
  'application/rtf': ['rtf'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.ms-powerpoint': ['ppt'],
  'application/vnd.wap.wmlc': ['wmlc'],
  'application/vnd.google-earth.kml+xml': ['kml'],
  'application/vnd.google-earth.kmz': ['kmz'],
  'application/x-7z-compressed': ['7z'],
  'application/x-cocoa': ['cco'],
  'application/x-java-archive-diff': ['jardiff'],
  'application/x-java-jnlp-file': ['jnlp'],
  'application/x-makeself': ['run'],
  'application/x-perl': ['pl', 'pm'],
  'application/x-pilot': ['prc', 'pdb'],
  'application/x-rar-compressed': ['rar'],
  'application/x-redhat-package-manager': ['rpm'],
  'application/x-sea': ['sea'],
  'application/x-shockwave-flash': ['swf'],
  'application/x-stuffit': ['sit'],
  'application/x-tcl': ['tcl', 'tk'],
  'application/x-x509-ca-cert': ['der', 'pem', 'crt'],
  'application/x-xpinstall': ['xpi'],
  'application/xhtml+xml': ['xhtml'],
  'application/zip': ['zip'],
  'application/octet-stream': ['msi', 'msp', 'msm'],
  'audio/midi': ['mid', 'midi', 'kar'],
  'audio/mpeg': ['mp3'],
  'audio/ogg': ['ogg'],
  'audio/x-realaudio': ['ra'],
  'video/3gpp': ['3gpp', '3gp'],
  'video/mpeg': ['mpeg', 'mpg'],
  'video/quicktime': ['mov'],
  'video/x-flv': ['flv'],
  'video/x-mng': ['mng'],
  'video/x-ms-asf': ['asx', 'asf'],
  'video/x-ms-wmv': ['wmv'],
  'video/x-msvideo': ['avi'],
  'video/mp4': ['m4v', 'mp4'],
};

export function getFileExtensionFromMimeType(mimeType: string) {
  return mimeTypesExtensionsMap[mimeType]?.[0] || '.dat';
}

export function getPictureDirPath() {
  switch (Platform.OS) {
    case 'android':
    case 'windows':
      return `${PicturesDirectoryPath}/My Album`;

    case 'ios':
    case 'macos':
      return `${LibraryDirectoryPath}/My Album`;

    default:
      return '';
  }
}
