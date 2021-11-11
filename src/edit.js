import { __ } from '@wordpress/i18n';
import { 
        useBlockProps, 
        InspectorControls
        } from '@wordpress/block-editor';
import {
        Placeholder, 
        SelectControl,
        PanelBody, 
        PanelRow,
        Spinner,
        Autocomplete
        } from '@wordpress/components';
import { pin } from '@wordpress/icons';
import { useState } from '@wordpress/element'
import { useSelect, select } from '@wordpress/data';
import './editor.scss';
import { store as coreStore } from '@wordpress/core-data';
import { get } from 'lodash';


 export default function Edit( { attributes, setAttributes } ) {

    // grabs the current post ID
    const currentPostId = select('core/editor').getCurrentPostId();
    
    // sets the query for the dropdown, showing all posts but excluding current one
    const query = {
		per_page: -1,
		exclude: currentPostId
	}

    // grabs all the posts
    const { posts } = useSelect( ( select ) => {
		return {
			posts: select( 'core' ).getEntityRecords('postType', 'post', query),
		};
    });	

    // creates the choices array for the dropdown
    let choices = [];

    // once posts load, push them to the choices array (ID & title only)
    // if the choices array is still populating, show loading in the dropdown
    if (posts) {
        choices.push({value:0, label:"Select Post"});
        posts.forEach(post => {
            choices.push({value: post.id, label: post.title.rendered});
        });
    } else {
        choices.push({value:0, label:"Loading"});
    }

    // grab the selected post and put it into its own array
	const currentPost = !posts 
		? posts 
		: posts.filter(item => item.id === attributes.selectedPost);

    // take the selected post and add a value to its object with the featured image URL
	const { postToDisplay } = useSelect( (select)  => {

		const { getMedia } = select(coreStore);

		return { postToDisplay: ! Array.isArray( currentPost )
			? currentPost
			: currentPost.map( ( post ) => {

				const image = getMedia( post.featured_media );

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


    


    // Dropdown to select the post is in the sidebar
    const getInspectorControls = () => {
		return (
			<InspectorControls>
                <PanelBody
                    title="Choose the post to display:"
                    initalOpen={true}
                >
                    <PanelRow>
                        <SelectControl
                            label="Select a post here:"
                            options={choices}
                            value={attributes.selectedPost}
                            onChange={(value) => setAttributes({selectedPost: parseInt(value)})}
                        />
                    </PanelRow>

                </PanelBody>
                <PanelBody
                    title="testing"
                >
                <PanelRow>
            
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
		);
	}

    // Checks if it's still loading or if a post has not been selected yet.
    const hasPost = !! postToDisplay?.length;
    if ( ! hasPost ) {
        return (
            [
            getInspectorControls(),
            <div { ...useBlockProps()} >
                <Placeholder icon={ pin } label={ __( 'Select A Post' ) }>
					{ ! Array.isArray( postToDisplay) ? (
						<Spinner />
					) : (
						__( 'Select a post via the settings sidebar.' )
					) }
				</Placeholder>
            </div>
            ]
        );
    }


    return (
        [
            getInspectorControls(),
            <div { ...useBlockProps()} >
                    <Placeholder>
                        <h3>{postToDisplay[0].title.rendered}</h3>
                        <img src={postToDisplay[0].featuredImageUrl} />
                    </Placeholder>
            </div>
        ]
    );
}
