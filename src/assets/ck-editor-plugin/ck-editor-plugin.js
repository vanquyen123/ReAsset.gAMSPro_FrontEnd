CKEDITOR.plugins.add('leaderdots', {

    icons: '/asset/img/a.png',
    init: function(editor) {
        editor.addCommand('insertLeaderDots', {
            exec: function(editor) {
                editor.insertHtml('<span style="display: flex;"> Text <span style="border-bottom-style: dotted;border-width: 1px;flex: 1;"></span> </span>');
            }
        });
        editor.ui.addButton('LeaderDots', {
            label: 'Insert LeaderDots',
            command: 'insertLeaderDots',
            toolbar: 'insert'
        });
    }
});


$.each(CKEDITOR.dtd.$removeEmpty, function(i, value) {
    CKEDITOR.dtd.$removeEmpty[i] = false;
});