import { processRoutes } from "../router";

describe('Router', () => {
    describe('buildMap', () => {
        let cyMock;
        beforeEach(() => {
            cyMock = jest.fn().mockReturnThis();
            global.cy = {
                route: cyMock,
                as: () => {}
            }
        });
    
        const routes = {
            'POST /api/route1': 'route1',
            'GET /api/route2': 'route2',
            'PUT /api/route3': 'route3',
            'DELETE /api/route4': 'route4',
            '/api/route5': 'route5',
        }

        it('Correctly builds a map of routes', () => {
            processRoutes(routes);

            expect(cyMock).toHaveBeenCalledTimes(5);
            expect(cyMock).toBeCalledWith('POST', '/api/route1', 'fixture:route1.json');
            expect(cyMock).toBeCalledWith('GET', '/api/route2', 'fixture:route2.json');
            expect(cyMock).toBeCalledWith('PUT', '/api/route3', 'fixture:route3.json');
            expect(cyMock).toBeCalledWith('DELETE', '/api/route4', 'fixture:route4.json');
            expect(cyMock).toBeCalledWith('GET', '/api/route5', 'fixture:route5.json');
        })
    });
})