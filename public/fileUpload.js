FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 100 / 100,
    imageResizeTargetWidth: 40,
    imageResizeTargetHeight: 40
})

FilePond.parse(document.body);