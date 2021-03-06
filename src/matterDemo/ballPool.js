import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import MatterWrap from 'matter-wrap';

import decomp from 'poly-decomp';
import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';

window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.use('matter-zIndex-plugin', 'constraint-inspector', MatterWrap);

let render;

const BallPool = props => {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Composites, Composite, Common } = Matter;

	useEffect(() => {
		// eslint-disable-next-line no-underscore-dangle
		Common._nextId = 0;
		// eslint-disable-next-line no-underscore-dangle
		Common._seed = 0;
		const engine = Engine.create();
		const { world } = engine;

		render = Render.create({
			element: sceneEl.current,
			engine,
			options: {
				width: 800,
				height: 600,
				wireframes: true,
				showAngleIndicator: true,
			},
		});

		Render.run(render);

		// create runner
		const runner = Runner.create();
		Runner.run(runner, engine);

		/** ***** connect inspector ***** */
		const inspector = {
			runner,
			world: engine.world,
			sceneElement: sceneEl.current,
			render,
			options: render.options,
			selectStart: null,
			selectBounds: render.bounds,
			selected: [],
		};
		runInspector(inspector);
		/** ***** connect inspector ***** */

		/** ***** Body ***** */
		// add bodies
		const stack = Composites.stack(100, 0, 10, 8, 10, 10, function(x, y) {
			return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
		});

		World.add(world, [stack, Bodies.polygon(200, 460, 3, 60), Bodies.polygon(400, 460, 5, 60)]);

		// fit the render viewport to the scene
		/* Render.lookAt(render, {
          min: { x: 0, y: 0 },
          max: { x: 800, y: 600 }
        }); */

		// wrapping using matter-wrap plugin
		const allBodies = Composite.allBodies(world);

		for (let i = 0; i < allBodies.length; i += 1) {
			allBodies[i].plugin.wrap = {
				min: { x: render.bounds.min.x - 100, y: render.bounds.min.y },
				max: { x: render.bounds.max.x + 100, y: render.bounds.max.y },
			};
		}

		const { width, height } = render.options;

		World.add(world, [
			// walls
			Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, label: 'Top wall' }),
			Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, label: 'Bottom wall' }),
			// Bodies.rectangle(width , height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
			// Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
		]);
		/** ***** Body ***** */

		// eslint-disable-next-line
  },[restart]);
	return <div ref={sceneEl} />;
};
export default BallPool;
