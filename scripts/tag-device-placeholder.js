const url = require('url');

/**
 * Given a lukeify_device_placeholder markdown tag, provide an HTML figure which contains a device placeholder and an
 * image to place inside the device. The deviceType parameter contains the exact design & UI of the layout.
 *
 * @syntax {% lukeify_device_placeholder image deviceType %}
 */
hexo.extend.tag.register('lukeify_device_placeholder', function(args, content) {
    const deviceTypes = ['silver-iphone-xs-skewed'];

    const slug = args[0];
    const deviceType = deviceTypes.find(dt => args[1]);

    if (!deviceType) {
        console.error('[lukeify_device_placeholder] No matching deviceType was found.');
        return;
    }

    const assetPost = hexo.model('PostAsset');
    const asset = assetPost.findOne({ post: this._id, slug });

    const appropriateUrl = url.resolve(hexo.config.root, asset.path);

    return `
    <figure class="device-placeholder ${deviceType}">
        <img class="device-placeholder-img" src="/images/device-placeholders/${deviceType}.png">
        <img class="device-screenshot-img" src="${appropriateUrl}">
    </figure>
    `;
});