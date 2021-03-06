const ConstraintInspector = {
	name: 'constraint-inspector',

	version: '0.1.0',

	for: 'matter-js@0.14.2',

	install: function install(base) {
		base.before('Render.inspector', function(inspector, context) {
			ConstraintInspector.Render.inspector(inspector, context);
		});
	},
	Render: {
		inspector(inspector, context) {
			const { selected } = inspector;

			/* if (options.hasBounds) {
        var boundsWidth = render.bounds.max.x - render.bounds.min.x,
          boundsHeight = render.bounds.max.y - render.bounds.min.y,
          boundsScaleX = boundsWidth / render.options.width,
          boundsScaleY = boundsHeight / render.options.height;

        context.scale(1 / boundsScaleX, 1 / boundsScaleY);
        context.translate(-render.bounds.min.x, -render.bounds.min.y);
      } */

			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < selected.length; i++) {
				const item = selected[i].data;

				context.translate(0.5, 0.5);
				// eslint-disable-next-line no-param-reassign
				context.lineWidth = 1;
				// eslint-disable-next-line no-param-reassign
				context.strokeStyle = 'rgba(255,165,0,0.9)';
				context.setLineDash([1, 2]);

				if (item.type === 'constraint' && item.bodyA) {
					context.beginPath();
					context.arc(
						item.bodyA.position.x + item.pointA.x,
						item.bodyA.position.y + item.pointA.y,
						10,
						0,
						2 * Math.PI,
					);
					context.closePath();
					context.stroke();

					context.beginPath();
					context.arc(
						item.bodyB.position.x + item.pointB.x,
						item.bodyB.position.y + item.pointB.y,
						10,
						0,
						2 * Math.PI,
					);
					context.closePath();
					context.stroke();
				} else if (item.type === 'mousePosition') {
					context.beginPath();
					context.arc(item.mouse.x, item.mouse.y, 10, 0, 2 * Math.PI);
					context.closePath();
					context.stroke();
				}

				context.setLineDash([]);
				context.translate(-0.5, -0.5);
			}
		},
	},

	// implement your plugin functions etc...
};
export default ConstraintInspector;
