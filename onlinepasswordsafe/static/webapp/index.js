App = Em.Application.create();


App.UsernameField = Em.TextField.extend();

App.ContentField = Em.TextField.extend();

App.PasswordField = Em.TextField.extend({
    insertNewline: function() {
        App.editorController.loadDossier();
    }
});


App.editorController = Em.Object.create({
    username: '',
    password: '',
    content: '',
    loadDossier: function() {
        var me = this;
        if ( me.get("username") && me.get("password") ) {
            var owner_hash = CryptoJS.PBKDF2(me.get("username"), "", { keySize: 512/32, iterations: 1000 }).toString();
            var access_hash = CryptoJS.PBKDF2(me.get("password"), "", { keySize: 512/32, iterations: 1000 }).toString();
            var url = 'http://localhost:6543/load.json'
                url += '?owner_hash=%@&access_hash=%@'.fmt(owner_hash, access_hash);
            $.getJSON(url,function(data) {
                $(data).each(function(index, value) {
                    me.set("content", value.content);
                })
            });
        }
    },
    saveDossier: function() {
        var me = this;
        if ( me.get("username") && me.get("password") ) {
            var owner_hash = CryptoJS.PBKDF2(me.get("username"), "", { keySize: 512/32, iterations: 1000 }).toString();
            var access_hash = CryptoJS.PBKDF2(me.get("password"), "", { keySize: 512/32, iterations: 1000 }).toString();
            var content = me.get("content");

            var post = $.post(
                "http://localhost:6543/save.json",
                { "owner_hash": owner_hash,
                  "access_hash": access_hash,
                  "content": me.get("content") }
            );
            
            post.success();
            
            post.error(function(error) {
                alert('Could not save the data.');
            });
        }
    }
});
