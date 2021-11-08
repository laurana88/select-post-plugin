import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps, BlockControls } from '@wordpress/block-editor';
import {TextControl, ToolbarButton, Placeholder, SelectControl} from '@wordpress/components';
import { useState } from '@wordpress/element'
import { useSelect, select } from '@wordpress/data';
import './editor.scss';
import { store as coreStore } from '@wordpress/core-data';
import { get } from 'lodash';


 export default function Edit( { attributes, setAttributes } ) {

    const [editMode, setEditMode] = useState(true);

    const getBlockControls = () => {
		return (
			<BlockControls>
                <ToolbarButton
                        label={ editMode ? "Preview" : "Edit" }
                        icon={ editMode ? "format-image" : "edit" }
                        className="my-custom-button"
                        onClick={() => {setEditMode(editMode ? false : true);}
                        }
                />
		    </BlockControls>
		);
	}

    const currentPostId = select('core/editor').getCurrentPostId();
    const query = {
		per_page: -1,
		exclude: currentPostId
	}

    const { posts } = useSelect( ( select ) => {
		return {
			posts: select( 'core' ).getEntityRecords('postType', 'post', query),
		};
    });	

    let choices = [];


    if (posts) {
        posts.forEach(post => {
            choices.push({value: post.id, label: post.title.rendered});
        });
    } else {
        choices.push({value:0, label:"Loading"});
    }


	const currentPost = !posts 
		? posts 
		: posts.filter(item => item.id === attributes.selectedPost);


	const { postToDisplay } = useSelect( (select)  => {

		const { getMedia } = select(coreStore);

		return { postToDisplay: ! Array.isArray( currentPost )
			? currentPost
			: currentPost.map( ( post ) => {

				const image = getMedia( post.featured_media );
				console.log('Image', image);

				let featuredImageUrl = get(
					image,
					[
						'media_details',
						'sizes',
						'medium',
						'source_url',
					],
					null
				);
				if ( ! featuredImageUrl ) {
					featuredImageUrl = get( image, 'source_url', null );
				}

				return { ...post, featuredImageUrl };
			} ),
		};
	});

	console.log('WITH MEDIA', postToDisplay);




    return (
        [
        getBlockControls(),
        <div { ...useBlockProps()} >
            {editMode && 
                <SelectControl
                    label="Selected Post"
                    options={choices}
                    value={attributes.selectedPost}
                    onChange={(value) => setAttributes({selectedPost: parseInt(value)})}
                />
            }
            {!editMode && 
                <Placeholder>
                    {/* <SelectControl
                        label="Selected Post"
                        options={choices}
                        value={attributes.selectedPost}
                        onChange={(value) => setAttributes({selectedPost: parseInt(value)})}
                    /> */}
					<h3>{postToDisplay[0].title.rendered}</h3>
					<img src={postToDisplay[0].featuredImageUrl} />
                </Placeholder>
            }
        </div>
    ]
    );
}
