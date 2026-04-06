import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
	testWidgets('smoke test renders a widget tree', (WidgetTester tester) async {
		await tester.pumpWidget(
			const MaterialApp(
				home: Scaffold(
					body: Text('DevDocs Test'),
				),
			),
		);

		expect(find.text('DevDocs Test'), findsOneWidget);
	});
}
