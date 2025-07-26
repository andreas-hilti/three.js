/* global QUnit */

import { BatchedMesh } from '../../../../src/objects/BatchedMesh.js';
import { BoxGeometry } from '../../../../src/geometries/BoxGeometry.js';
import { MeshBasicMaterial } from '../../../../src/materials/MeshBasicMaterial.js';

export default QUnit.module( 'Objects', () => {

	QUnit.module( 'BatchedMesh', () => {

		// PUBLIC

		QUnit.test( 'performance', ( assert ) => {

			const box = new BoxGeometry( 1, 1, 1 );
			const material = new MeshBasicMaterial( { color: 0x00ff00 } );
			
			// initialize and add a geometry into the batched mesh
			const n = 50000;
			const batchedMesh = new BatchedMesh( n, 5000, 10000, material );
			const boxGeometryId = batchedMesh.addGeometry( box );
			
			// create instances of this geometry
			let boxInstanceIds = [];
			for (let i = 0; i < n; i++){
				boxInstanceIds.push( batchedMesh.addInstance( boxGeometryId ) );
			}
			
			// remove them
			for (let boxInstanceId of boxInstanceIds){
				batchedMesh.deleteInstance( boxInstanceId );
			}

			// add them again
			boxInstanceIds = [];
			for (let i = 0; i < n; i++){
				boxInstanceIds.push( batchedMesh.addInstance( boxGeometryId ) );
			}

			assert.ok( batchedMesh.instanceCount === n, 'wrong instance count' );

		} );

		QUnit.test( 'performance2', ( assert ) => {

			const box = new BoxGeometry( 1, 1, 1 );
			const material = new MeshBasicMaterial( { color: 0x00ff00 } );
			
			// initialize and add a geometry into the batched mesh
			const n = 50000;
			const batchedMesh = new BatchedMesh( n, 5000*n, 10000*n, material );
			
			// create instances of this geometry
			let boxInstanceIds = [];
			let boxGeometryIds = [];
			for (let i = 0; i < n; i++){
				const boxGeometryId = batchedMesh.addGeometry( box );
				boxGeometryIds.push(boxGeometryId);
				boxInstanceIds.push( batchedMesh.addInstance( boxGeometryId ) );
			}
			
			// remove them
			// this is slow:
			// for (let boxGeometryId of boxGeometryIds){
			// 	batchedMesh.deleteGeometry( boxGeometryId );
			// }
			// this is quicker:
			for (let boxInstanceId of boxInstanceIds){
				batchedMesh.deleteInstance( boxInstanceId );
		   	}
			batchedMesh.setInstanceCount(1)
			batchedMesh.setInstanceCount(n)
			for (let boxGeometryId of boxGeometryIds){
			 	batchedMesh.deleteGeometry( boxGeometryId );
			}

			// add them again
			boxInstanceIds = [];
			boxGeometryIds = [];
			for (let i = 0; i < n; i++){
				const boxGeometryId = batchedMesh.addGeometry( box );
				boxGeometryIds.push(boxGeometryId);
				boxInstanceIds.push( batchedMesh.addInstance( boxGeometryId ) );
			}

			assert.ok( batchedMesh.instanceCount === n, 'wrong instance count' );

		} );		

		QUnit.test( 'performance3', ( assert ) => {

			const box = new BoxGeometry( 1, 1, 1 );
			const material = new MeshBasicMaterial( { color: 0x00ff00 } );
			
			// initialize and add a geometry into the batched mesh
			const n = 50000;
			const batchedMesh = new BatchedMesh( n, 5000, 10000, material );
			const boxGeometryId = batchedMesh.addGeometry( box );
			
			// create instances of this geometry
			let boxInstanceIds = [];
			for (let i = 0; i < n; i++){
				boxInstanceIds.push( batchedMesh.addInstance( boxGeometryId ) );
			}
			
			// remove them
			for (let boxInstanceId of boxInstanceIds){
				batchedMesh.deleteInstance( boxInstanceId );
			}

			// now there are n unused instanceids

			// add and remove a single instance repeatedly
			for ( let i = 0; i < n; i ++ ) {
				let boxInstanceId = batchedMesh.addInstance( boxGeometryId );
				batchedMesh.deleteInstance( boxInstanceId );
			}

			assert.ok(batchedMesh._availableInstanceIds.length === n, "wrong number of unused ids")
			assert.ok( batchedMesh.instanceCount === 0, 'wrong instance count' );

		} );

		QUnit.test( 'setInstanceCount', ( assert ) => {

			const box = new BoxGeometry( 1, 1, 1 );
			const material = new MeshBasicMaterial( { color: 0x00ff00 } );
			
			// initialize and add a geometry into the batched mesh
			const batchedMesh = new BatchedMesh( 4, 5000, 10000, material );
			const boxGeometryId = batchedMesh.addGeometry( box );
			
			// create instances of this geometry
			let boxInstanceIds = [];
			for (let i = 0; i < 4; i++){
				boxInstanceIds.push( batchedMesh.addInstance( boxGeometryId ) );
			}
			
			batchedMesh.deleteInstance( boxInstanceIds[2] );
			batchedMesh.deleteInstance( boxInstanceIds[3] );

			// shrink the instance count
			batchedMesh.setInstanceCount(2);

			assert.ok( batchedMesh.instanceCount === 2, 'instance count unequal 2' );

		} );

	} );

} );
