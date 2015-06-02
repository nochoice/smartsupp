var app = {};


app.History = function(options){

	if (!(this instanceof app.History)) {
		return new app.History(options);
	}

	var instance = this;

	instance.editor = options.editor;
	instance.historyState = 0;
	instance.history = [];

	document.getElementById('back').addEventListener('click', instance.back.bind(instance));
	document.getElementById('prev').addEventListener('click', instance.prev.bind(instance));

	instance.editor.textarea.addEventListener('keyup', instance.keyUpHandler.bind(instance));

};

app.History.prototype = {
	back: function(){

		var instance = this,
			editor = instance.editor;

		instance.historyState --;
		if(instance.history[instance.historyState]){
			editor.textarea.value = instance.history[instance.historyState];
			editor.generate();
		}else{
			instance.historyState ++;
		}

	},

	prev: function(){

		var instance = this,
			editor = instance.editor;

		instance.historyState ++;

		if(instance.history[instance.historyState]){
			editor.textarea.value = instance.history[instance.historyState];
			editor.generate();
		}else{
			instance.historyState --;
		}
	},

	keyUpHandler: function(e){
		var instance = this,
			key = e.keyCode;

		instance.editor.generate();

		if(key === 9 || key === 13 || key === 32){
			instance.history.length = instance.historyState;
			instance.history.push(instance.editor.textarea.value);
			instance.historyState ++;
		}

	}
};

app.Editor = function(options){
	
	if (!(this instanceof app.Editor)) {
		return new app.Editor(options);
	}

	var instance = this;

	instance.blocks = [];
	instance.history = [];
	instance.historyState = 0;

	instance.textarea = document.getElementById(options.textareaId);
	instance.code = document.getElementById(options.codeId);
	instance.showcase = document.getElementById(options.showCaseId);	
	

	instance.textarea.addEventListener('keydown', instance.keyDownHandler.bind(instance));

	instance.generate();
};


app.Editor.prototype = {

	generate: function(){
		var instance = this;

		var tree = instance.generateTree(instance.getLines(), 0, {name: 'root', children: []}, 0);
		var blocks = instance.getBlocks(tree);
		var preparedTree = instance.prepareTree(tree, blocks);
		var html = instance.render(preparedTree);

		instance.code.innerHTML = html.replace(/</g, '&lt;' );
		instance.showcase.innerHTML = html; 
	},

	render: function(tree){
		var html = "";

		function renderer(pTree, depth){
	 		var i,
	 			blockPart,
	 			item,
	 			tab = '';

	 		for(i=0;i<depth; i++){
	 			tab += '\t';
	 		}
	 		for(i=0; i<pTree.length; i++){
	 			var item = pTree[i];

				html += tab + '<div class="' +item.name.trim()+ '">\n'
				if(pTree[i].children.length){
					renderer(pTree[i].children, depth+1);
				}
				else html += tab + '\ttext\n';

				html += tab + '</div>\n';
	 		}
	 	};

		renderer(tree, 0);
		return html;
	},

	prepareTree: function(tree, blocks){
	 	var treeNoBlocks,
	 		indOf;

	 	treeNoBlocks = tree.children.filter(function(item){
	 		indOf = item.name.indexOf('block');
			return indOf !== 0;
	 	});

	 	function prepare(pTree, depth){
	 		var i,
	 			blockPart;

	 		for(i=0; i<pTree.length; i++){
				pTree[i].name = pTree[i].name.trim();

				if(blocks[pTree[i].name]) {
					blockPart = blocks[pTree[i].name][0];

					pTree[i].children = blockPart.children;
					pTree[i].name = blockPart.name
				}

				prepare(pTree[i].children, depth+1);

	 		}
	 	};

		prepare(treeNoBlocks, 0);
// 	 	console.log(treeNoBlocks);

	 	return treeNoBlocks;
	},

	getBlocks: function(tree){
		var blocks,
			block,
			indOf,
			i,
			blocksObj = {};

		blocks = tree.children.filter(function(item){

			indOf = item.name.indexOf('block');
			return indOf === 0;

		});

		for(i=0; i<blocks.length; i++){
			block = blocks[i];
			blocksObj[block.name.substring(6)] = block.children;
		}
		
		return blocksObj;
	},

	generateTree: function(lines, lineNum, parent, depthCurrent){
// 		console.log(lineNum, parent, depthCurrent);
		var instance = this;

		
		function tree(depthCurrent, parent, lineStart){
		  var i, line, depth, item;

		  for(i=lineStart; i<lines.length - 1; i++){

			line = lines[i];
			depth = instance.getDepth(line);

			if(depthCurrent>depth) break;

			if(depthCurrent === depth){

				item = {name: line, children:[]};

				tree(depth+1, item, i+1);
				parent.children.push(item);

			}
		  }
		}

		tree(0, parent, 0);
		return parent;
	},

	getDepth: function(line){
		var instance = this,
			segment, i, depth = 0;

		segment = line.split('\t');

		for(i = 0; i<segment.length; i++){
			if(segment[i] === '') depth++;
			else return depth;
		}
// 		console.log(segment);

	},
	/* prechod cez textareu a navratenie polia s riadkami */
	getLines: function(){
		var instance = this;

		return instance.textarea.value.split('\n');
	},

	keyDownHandler: function(e){

		var textarea = e.target,
			value = textarea.value,
			selectionStart = textarea.selectionStart,
			selectionEnd = textarea.selectionEnd;
	
		if(e.keyCode === 9){	// tabulator
			e.preventDefault();
			textarea.value = value.substring(0, selectionStart)
                    + "\t"
                    + value.substring(selectionEnd);
            
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
		}
	}
};

editor = new app.Editor({
	textareaId: 'editor',
	showCaseId: 'showcase',
	codeId: 'code'
});

history = new app.History({editor: editor});
