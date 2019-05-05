const url = require('url');

/**
 * Given a lukeify_video markdown tag, produce a native video tag that exposes a video with controls, of the provided
 * type.
 *
 * @syntax {% lukeify_video videoUrl type %}
 */
hexo.extend.tag.register('lukeify_video', function(args, content) {

    // Prevent the use of the tag if less or more than two tags were provided.
    if (args.length !== 2) {
        console.error('[lukeify_video] An incorrect number of arguments was supplied.');
        return;
    }

    // Given the URL of the video, find the postasset associated with the video, then determine an appropriate URL
    // for the video given current configuration & the video's path.
    const slug = args[0];
    const assetPost = hexo.model('PostAsset');

    const asset = assetPost.findOne({post: this._id, slug });

    const appropriateUrl = url.resolve(hexo.config.root, asset.path);

    return `
    <video controls="true">
        <source src="${appropriateUrl}" type="${args[1]}">
        <p>Your browser doesn't support HTML5 video. Here is a <a href="${appropriateUrl}">link to the video</a> instead.</p>
    </video>`;
});