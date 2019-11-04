var doAfterRender = [];

function handleRenderDone() {
  doAfterRender.forEach(function (f) {
    f();
  });
}
