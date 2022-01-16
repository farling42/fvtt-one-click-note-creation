/**
 * Left clicking on the notes layer should allow a new note to be created.
 * @param  event
 */
 async function NotesLayer_onClickLeft(event) {
	console.log(`Note_onClickLeft: ${event.data.origin.x} ${event.data.origin.y} == ${event.data.global.x} ${event.data.global.y}`);
	// Create a new Note at the cursor position and open the Note configuration window for it.
    const noteData = {x: event.data.origin.x, y: event.data.origin.y};

	if (game.version) {
		// v9
		this._createPreview(noteData, {top: event.data.global.y - 20, left: event.data.global.x + 40});
	} else {
		// v8
	    // Create a NoteConfig sheet instance to finalize the creation
	    const cls = getDocumentClass("Note")
	    const document = new cls(noteData, {parent: canvas.scene});
	    if ( !document.canUserModify(game.user, "create" ) ) {
	      return ui.notifications.warn(game.i18n.format("NOTE.WarningNoCreate", {name: entry.name}));
	    }
	    // Create the preview object to complete creation
	    const object = new Note(document);
	    this.activate();
	    this.preview.addChild(object);
	    await object.draw();
	    object.sheet.render(true, {
	      top:  event.data.global.y - 20,
	      left: event.data.global.x + 40
	    });	
	}
}

Hooks.once('canvasInit', () => {
    	// This module is only required for GMs (game.user accessible from 'ready' event but not 'init' event)
	if (game.user.isGM) {
        libWrapper.register("one-click-note-creation", 'NotesLayer.prototype._onClickLeft', NotesLayer_onClickLeft, libWrapper.OVERRIDE);
	}
})