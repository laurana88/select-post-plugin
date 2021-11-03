import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps, BlockControls } from '@wordpress/block-editor';
import {TextControl, ToolbarButton, Placeholder, SelectControl} from '@wordpress/components';
import { useState } from '@wordpress/element'
import { useSelect, select } from '@wordpress/data';
import './editor.scss';


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
	let currentPost = [];

	const findPost = (item) => {
		if (item.id === attributes.selectedPost) {
			return item;
		}
	}

    if (posts) {
        posts.forEach(post => {
            choices.push({value: post.id, label: post.title.rendered});
        });
		currentPost = posts.filter(findPost);
    } else {
        choices.push({value:0, label:"Loading"});
    }

	console.log("array of posts", posts);
	console.log('current post', currentPost);

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
					<h3>{currentPost[0].title.rendered}</h3>
                </Placeholder>
            }
        </div>
    ]
    );
}
