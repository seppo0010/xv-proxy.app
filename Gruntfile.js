module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build',
        // mac_icns: './example/icon.icns', // Path to the Mac icon file
        mac: true,
        win: false,
        linux32: false,
        linux64: false,
      },
      src: './public/**/*'
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};
