var gulp = require('gulp');
var packager = require('electron-packager');

gulp.task('package:darwin', function(done) {
    packager({
        dir: 'dist', // アプリケーションのパッケージとなるディレクトリ
        out: './release/darwin', // .app や .exeの出力先ディレクトリ
        name: 'ElectronApp', // アプリケーション名
        arch: 'x64', // CPU種別. x64 or ia32
        platform: 'darwin', // OS種別. darwin or win32 or linux
        version: '0.28.1' // Electronのversion
    }, function(err, path) {
        // 追加でパッケージに手を加えたければ, path配下を適宜いじる
        done();
    });
});
