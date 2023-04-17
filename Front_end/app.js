const albums={
	documentID:'data',
	index:function(){
		document.getElementById('albums').innerHTML='Loading albums, please wait...';
		database.index(albums.documentID,function(items){
			document.getElementById('albums').innerHTML='';
			for(let i=0;i<items.length;i++){
				console.log(i);
				let item = document.createElement('div');
				
				if(i%2 == 0){
					item.style.backgroundColor='#FF4365';
				}
				else{
					item.style.backgroundColor='#00D9C0';
				}

				item.innerHTML =`<blockquote>
							<em><a href="detail.html?index=${i}"><text style="color:black">${items[i].album}</a></em>
						</blockquote>
						${items[i].band}`;
					document.getElementById('albums').append(item);
				
			}
		});
	},
	detail:function(index){
		database.detail(albums.documentID,index,function(item){
			document.getElementById('loading').style.display='none';
			document.getElementById('album-band').innerText=item.band;
			document.getElementById('album-text').innerText=item.album;
			document.getElementById('album-year').innerText=`${item.year}`;
			document.getElementById('album-genre').innerText=`${item.genre}`;
			document.getElementById('album-label').innerText=`${item.label}`;
			document.getElementById('album-description').innerText=`${item.description}`;
			document.getElementById('btn-edit').setAttribute('href',`edit.html?index=${index}`);
			document.getElementById('btn-review').setAttribute('href',`review.html?index=${index}`);
	
			let deleteButton=document.getElementById('btn-delete');
			deleteButton.addEventListener('click',function(){
				database.delete(albums.documentID,index);
			});
	
			// loop through reviews array and create new HTML element for each review
			let reviewsDiv = document.getElementById('reviews');
			if (item.reviews) {
				for (let i = 0; i < item.reviews.length; i++) {
					let review = item.reviews[i];
					let reviewDiv = document.createElement('div');
					reviewDiv.innerHTML = `<p>${review.name}: ${review.text}</p>`;
					reviewsDiv.appendChild(reviewDiv);
				}
			}
		});
	},
	create:function(){
		document.querySelector('form').addEventListener('submit',function(e){
			e.preventDefault();
			let band=document.querySelector('form input[name=band]');
			let album=document.querySelector('form input[name=album]');
			let genre=document.querySelector('form input[name=genre]');
			let year=document.querySelector('form input[name=year]');
			let label=document.querySelector('form input[name=label]');
			let description=document.querySelector('form textarea[name=description]');
			let review = {
				"name":"",
				"review":""
			}
			let newAlbum={
				band:band.value,
				album:album.value,
				genre:genre.value,
				year:year.value,
				label:label.value,
				description:description.value,
				review:review.value
			}
			database.create(albums.documentID,newAlbum);
		});
	}
,
	update:function(index){
		database.detail(albums.documentID,index,function(item){
			document.getElementById('loading').style.display='none';
			document.querySelector('form input[name=band]').value=item.band;
			document.querySelector('form textarea[name=album]').value=item.album;
			
			document.querySelector('form').addEventListener('submit',function(e){
				e.preventDefault();
				let band=document.querySelector('form input[name=band]');
				let album=document.querySelector('form textarea[name=album]');
				let newAlbum={
					band:band.value,
					album:album.value
				}
				database.update(albums.documentID,index,newAlbum);
			});
		});
	},
	review: function(index) {
		database.detail(albums.documentID, index, function(item) {
		  console.log(item); // Log the entire 'item' object to the console
	  
		  document.getElementById('loading').style.display = 'none';
		  document.getElementById('album-band').innerText = item.band;
		  document.getElementById('album-text').innerText = item.album;
		  if (item.review) {
			document.querySelector('form input[name=name]').value = item.review.name;
			document.querySelector('form textarea[name=review]').value = item.review.text;
		  }
	  
		  document.querySelector('form').addEventListener('submit', function(e) {
			e.preventDefault();
			let band = item.band
			let album = item.album
			let genre=item.genre;
			let year=item.year;
			let label=item.label;
			let description=item.description;
			let name = document.querySelector('form input[name=name]');
			let review = document.querySelector('form textarea[name=review]');
			let newReview = {
			  name: name.value,
			  text: review.value
			}
			if (!item.reviews) {
			  item.reviews = []; // Create a new 'reviews' array if it doesn't exist
			}
			item.reviews.push(newReview); // Add the new review to the 'reviews' array
			let newAlbum = {
			  band: band,
			  album: album,
			  genre: genre,
			  year: year,
			  label: label,
			  description: description,
			  reviews: item.reviews // Use the updated 'reviews' array in the new album object
			}
			database.update(albums.documentID, index, newAlbum);
		  });
		});
	  }
	  
	  
	  
}