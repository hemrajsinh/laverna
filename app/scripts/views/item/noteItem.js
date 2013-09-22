/*global define */
define(['underscore', 'marionette', 'text!noteItemTempl', 'showdown'],
function (_, Marionette, Template, Showdown) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: _.template(Template),

        className: 'content-notes',

        events: {
            'click .favorite': 'favorite'
        },

        initialize: function() {
            this.model.on('change:isFavorite', this.render);
            this.listenTo(this.model, 'change', this.changeFocus);
            this.collection = this.collection.filter(function(model){
                return model.get('parentId') === this.model.get('id');
            }, this);
        },

        changeFocus: function() {
            $('#sidebar #note-' + this.model.get('id')).addClass('active');
        },

        favorite: function() {
            var isFavorite = (this.model.get('isFavorite') === 1) ? 0 : 1;
            this.model.save({'isFavorite': isFavorite});
        },

        templateHelpers: function() {
            var data = this;
            return {
                getProgress: function(taskCompleted, taskAll) {
                    return taskCompleted * 100 / taskAll;
                },
                getContent: function(text) {
                    var converter = new Showdown.converter();
                    return converter.makeHtml(text);
                },
                getChilds: function() {
                    return data.collection;
                },

                // Generate link
                link: function (id, page, notebook) {
                    var url = '/note/show/';
                    notebook = (notebook === undefined) ? 0 : notebook;

                    if (page !== undefined) {
                        url += notebook + '/p' + page + '/show/';
                    }

                    return url + id;
                }
            };
        }
    });

    return View;
});
